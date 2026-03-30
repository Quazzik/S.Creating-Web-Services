import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography, Modal, Popconfirm, message } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { showAddNotification, showDeleteNotification, showEditNotification, showErrorNotification } from '../services/notificationService';
import { authService } from '../services/auth';
import { history } from 'umi';
import { DictionaryItem, carBrandApi, trimLevelApi } from '../services/carDictionaryService';

const { Title } = Typography;

export default function DictionariesPage() {
  
  const [carBrands, setCarBrands] = useState<DictionaryItem[]>([]);
  const [trimLevels, setTrimLevels] = useState<DictionaryItem[]>([]);
  
  const [newCarBrand, setNewCarBrand] = useState('');
  const [newTrimLevel, setNewTrimLevel] = useState('');
  
  const [editingItem, setEditingItem] = useState<DictionaryItem | null>(null);
  const [editingIsCarBrand, setEditingIsCarBrand] = useState(false);
  const [editingValue, setEditingValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingLevels, setLoadingLevels] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      history.push('/401');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadCarBrands(), loadTrimLevels()]);
  };

  const loadCarBrands = async () => {
    try {
      setLoadingBrands(true);
      const data = await carBrandApi.getAll();
      setCarBrands(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showErrorNotification(error.message, `Ошибка загрузки марок`);
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadTrimLevels = async () => {
    try {
      setLoadingLevels(true);
      const data = await trimLevelApi.getAll();
      setTrimLevels(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showErrorNotification(error.message, `Ошибка загрузки комплектаций`);
    } finally {
      setLoadingLevels(false);
    }
  };

  // === Car Brands ===
  const addCarBrand = async () => {
    if (!newCarBrand.trim()) return;
    try {
      const newBrand = await carBrandApi.create(newCarBrand.trim());
      setCarBrands(prev => [...prev, newBrand]);
      setNewCarBrand('');
      showAddNotification('автобрендов', newBrand.name, carBrands.length + 1);

    } catch (error: any) {
      if (error.message.includes('401'))
      {
        authService.logout();
        return;
      }
      showErrorNotification(error.message);
    }
  };

  const deleteCarBrand = async (id: number) => {
    const brand = carBrands.find(b => b.id === id);
    if (!brand) return;
    try {
      await carBrandApi.delete(id);
      setCarBrands(prev => prev.filter(b => b.id !== id));
      showDeleteNotification('автобрендов', brand.name, carBrands.length - 1);
    } catch (error: any) {
      if (error.message.includes('401')) {
        authService.logout();
        return;
      }
      showErrorNotification(error.message);
    }
  };

  // === Trim Levels ===
  const addTrimLevel = async () => {
    if (!newTrimLevel.trim()) return;
    try {
      const newLevel = await trimLevelApi.create(newTrimLevel.trim());
      setTrimLevels(prev => [...prev, newLevel]);
      setNewTrimLevel('');
      showAddNotification('комплектаций', newLevel.name, trimLevels.length + 1);
    } catch (error: any) {
      if (error.message.includes('401')) {
        authService.logout();
        return;
      }
      showErrorNotification(error.message);
    }
  };

  const deleteTrimLevel = async (id: number) => {
    const level = trimLevels.find(l => l.id === id);
    if (!level) return;
    try {
      await trimLevelApi.delete(id);
      setTrimLevels(prev => prev.filter(l => l.id !== id));
      showDeleteNotification('комплектаций', level.name, trimLevels.length - 1);
    } catch (error: any) {
      if(error.message.includes('401')) {
        authService.logout();
        return;
      }
      showErrorNotification(error.message)
    }
  };

  // === Edit ===
  const openEditModal = (item: DictionaryItem, isCarBrand: boolean) => {
    setEditingItem(item);
    setEditingIsCarBrand(isCarBrand);
    setEditingValue(item.name);
    setIsModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!editingItem || !editingValue.trim()) return;
    const oldName = editingItem.name;
    const newName = editingValue.trim();
    
    try {
      if (editingIsCarBrand) {
        await carBrandApi.update(editingItem.id, newName);
        setCarBrands(prev => prev.map(b => 
          b.id === editingItem.id ? { ...b, name: newName } : b
        ));
        showEditNotification('справочнике автобрендов', oldName, newName);
      } else {
        await trimLevelApi.update(editingItem.id, newName);
        setTrimLevels(prev => prev.map(l => 
          l.id === editingItem.id ? { ...l, name: newName } : l
        ));
        showEditNotification('справочнике комплектаций', oldName, newName);
      }
      setIsModalVisible(false);
      setEditingItem(null);
      setEditingValue('');
    } catch (error: any) {
      if(error.message.includes('401')) {
        authService.logout();
        return;
      }
      showErrorNotification(error.message)
    }
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    setEditingValue('');
  };

  // === Columns ===
  const carBrandColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Название', dataIndex: 'name', key: 'name', width: 300, ellipsis: true },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_: any, record: DictionaryItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record, true)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить элемент?"
            description="Это действие необратимо."
            onConfirm={() => deleteCarBrand(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>Удалить</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const trimLevelColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Название', dataIndex: 'name', key: 'name', width: 300, ellipsis: true },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_: any, record: DictionaryItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record, false)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить элемент?"
            description="Это действие необратимо."
            onConfirm={() => deleteTrimLevel(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>Удалить</Button>
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
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={addCarBrand} loading={loadingBrands}>
              Добавить
            </Button>
            <Button onClick={loadCarBrands} loading={loadingBrands}>Обновить</Button>
          </Space>
          <Table
            columns={carBrandColumns}
            dataSource={carBrands}
            rowKey="id"
            pagination={false}
            scroll={{ x: 530, y: 250 }}
            loading={loadingBrands}
          />
        </Card>

        <Card title="Список комплектаций">
          <Space style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Название"
              value={newTrimLevel}
              onChange={(e) => setNewTrimLevel(e.target.value)}
              onPressEnter={addTrimLevel}
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={addTrimLevel} loading={loadingLevels}>
              Добавить
            </Button>
            <Button onClick={loadTrimLevels} loading={loadingLevels}>Обновить</Button>
          </Space>
          <Table
            columns={trimLevelColumns}
            dataSource={trimLevels}
            rowKey="id"
            pagination={false}
            scroll={{ x: 530, y: 250 }}
            loading={loadingLevels}
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