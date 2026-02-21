import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography, Modal, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { showAddNotification, showDeleteNotification, showEditNotification } from '../utils/notifications';

const { Title } = Typography;

interface Item {
  id: number;
  name: string;
  isCarBrand?: boolean;
}

export default function DictionariesPage() {
  const [carBrands, setCarBrands] = useState<Item[]>([]);
  const [comfortLevels, setComfortLevels] = useState<Item[]>([]);
  const [newCarBrand, setNewCarBrand] = useState('');
  const [newComfortLevel, setNewComfortLevel] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log(`Количество автобрендов: ${carBrands.length}`);
  }, [carBrands]);

  useEffect(() => {
    console.log(`Количество уровней комфорта: ${comfortLevels.length}`);
  }, [comfortLevels]);

  const addCarBrand = () => {
    if (newCarBrand.trim()) {
      const newId = carBrands.length > 0 ? Math.max(...carBrands.map(b => b.id)) + 1 : 1;
      const newBrand = { id: newId, name: newCarBrand.trim() };
      setCarBrands([...carBrands, newBrand]);
      setNewCarBrand('');
      showAddNotification('автобрендов', newBrand.name, carBrands.length + 1);
    }
  };

  const addComfortLevel = () => {
    if (newComfortLevel.trim()) {
      const newId = comfortLevels.length > 0 ? Math.max(...comfortLevels.map(l => l.id)) + 1 : 1;
      const newLevel = { id: newId, name: newComfortLevel.trim() };
      setComfortLevels([...comfortLevels, newLevel]);
      setNewComfortLevel('');
      showAddNotification('уровней комфорта', newLevel.name, comfortLevels.length + 1);
    }
  };

  const deleteCarBrand = (id: number) => {
    const brandToDelete = carBrands.find(b => b.id === id);
    if (brandToDelete) {
      setCarBrands(carBrands.filter(b => b.id !== id));
      showDeleteNotification('автобрендов', brandToDelete.name, carBrands.length - 1);
    }
  };

  const deleteComfortLevel = (id: number) => {
    const levelToDelete = comfortLevels.find(l => l.id === id);
    if (levelToDelete) {
      setComfortLevels(comfortLevels.filter(l => l.id !== id));
      showDeleteNotification('уровней комфорта', levelToDelete.name, comfortLevels.length - 1);
    }
  };

  const openEditModal = (item: Item, isCarBrand: boolean) => {
    setEditingItem({ ...item, isCarBrand });
    setEditingValue(item.name);
    setIsModalVisible(true);
  };

  const handleEditSave = () => {
    if (editingItem && editingValue.trim()) {
      const oldName = editingItem.name;
      const updatedItem = { ...editingItem, name: editingValue.trim() };
      if (editingItem.isCarBrand) {
        setCarBrands(carBrands.map(b => b.id === editingItem.id ? updatedItem : b));
        showEditNotification('справочнике автобрендов', oldName, updatedItem.name);
      } else {
        setComfortLevels(comfortLevels.map(l => l.id === editingItem.id ? updatedItem : l));
        showEditNotification('справочнике уровней комфорта', oldName, updatedItem.name);
      }
      setIsModalVisible(false);
      setEditingItem(null);
      setEditingValue('');
    }
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    setEditingValue('');
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
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record, true)}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот элемент?"
            description="Это действие необратимо."
            onConfirm={() => deleteCarBrand(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Удалить
            </Button>
          </Popconfirm>
        </Space>
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
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record, false)}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот элемент?"
            description="Это действие необратимо."
            onConfirm={() => deleteComfortLevel(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: '20px' }}>
        <Title level={2}>Редактирование справочников</Title>

        <Card title="Список автобрендов" style={{ marginBottom: '20px' }}>
          <Space style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Название"
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
            scroll={{ y: 250 }}
          />
        </Card>

        <Card title="Список уровней комфорта">
          <Space style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Название"
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
            scroll={{ y: 250 }}
          />
        </Card>
      </div>
      <Modal
        title="Редактировать элемент"
        open={isModalVisible}
        onOk={handleEditSave}
        onCancel={handleEditCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Input
          placeholder="Название"
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onPressEnter={handleEditSave}
        />
      </Modal>
    </>
  );
}