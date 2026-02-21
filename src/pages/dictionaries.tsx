import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Item {
  id: number;
  name: string;
}

export default function DictionariesPage() {
  const [carBrands, setCarBrands] = useState<Item[]>([]);
  const [comfortLevels, setComfortLevels] = useState<Item[]>([]);
  const [newCarBrand, setNewCarBrand] = useState('');
  const [newComfortLevel, setNewComfortLevel] = useState('');

  useEffect(() => {
    console.log(`Количество автобрендов: ${carBrands.length}`);
  }, [carBrands]);

  useEffect(() => {
    console.log(`Количество уровней комфорта: ${comfortLevels.length}`);
  }, [comfortLevels]);

  const addCarBrand = () => {
    if (newCarBrand.trim()) {
      const newId = carBrands.length > 0 ? Math.max(...carBrands.map(b => b.id)) + 1 : 1;
      setCarBrands([...carBrands, { id: newId, name: newCarBrand.trim() }]);
      setNewCarBrand('');
    }
  };

  const addComfortLevel = () => {
    if (newComfortLevel.trim()) {
      const newId = comfortLevels.length > 0 ? Math.max(...comfortLevels.map(l => l.id)) + 1 : 1;
      setComfortLevels([...comfortLevels, { id: newId, name: newComfortLevel.trim() }]);
      setNewComfortLevel('');
    }
  };

  const deleteCarBrand = (id: number) => {
    setCarBrands(carBrands.filter(b => b.id !== id));
  };

  const deleteComfortLevel = (id: number) => {
    setComfortLevels(comfortLevels.filter(l => l.id !== id));
  };

  const carBrandColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Item) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteCarBrand(record.id)}
        >
          Удалить
        </Button>
      ),
    },
  ];

  const comfortLevelColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Item) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteComfortLevel(record.id)}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Редактирование справочников</Title>

      <Card title="Список автобрендов" style={{ marginBottom: '20px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Введите название автобренда"
            value={newCarBrand}
            onChange={(e) => setNewCarBrand(e.target.value)}
            onPressEnter={addCarBrand}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addCarBrand}>
            Добавить
          </Button>
        </Space>
        <Table
          columns={carBrandColumns}
          dataSource={carBrands}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="Список уровней комфорта">
        <Space style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Введите название уровня комфорта"
            value={newComfortLevel}
            onChange={(e) => setNewComfortLevel(e.target.value)}
            onPressEnter={addComfortLevel}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addComfortLevel}>
            Добавить
          </Button>
        </Space>
        <Table
          columns={comfortLevelColumns}
          dataSource={comfortLevels}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}