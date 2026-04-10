import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Typography, Modal, Popconfirm, Select, InputNumber } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { showCarAddedNotification, showCarDeletedNotification, showCarEditedNotification, showErrorNotification } from '../services/notificationService';
import { authService } from '../services/auth';
import { history } from 'umi';
import { CarItem, DictionaryItem, carApi, carBrandApi, trimLevelApi } from '../services/carDictionaryService';
import BrandPieChart from '../components/BrandPieChart';
import TrimBarChart from '../components/TrimBarChart';

const { Title } = Typography;

export default function CarsPage() {
  
  const [cars, setCars] = useState<CarItem[]>([]);
  const [carBrands, setCarBrands] = useState<DictionaryItem[]>([]);
  const [trimLevels, setTrimLevels] = useState<DictionaryItem[]>([]);
  
  const [newCar, setNewCar] = useState<{ name: string; carBrandId: number | null; trimLevelId: number | null; amount: number }>({
    name: '',
    carBrandId: null,
    trimLevelId: null,
    amount: 1,
  });
  
  const [editingItem, setEditingItem] = useState<CarItem | null>(null);
  const [editingValue, setEditingValue] = useState<{ name: string; carBrandId: number | null; trimLevelId: number | null; amount: number }>({
    name: '',
    carBrandId: null,
    trimLevelId: null,
    amount: 1,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      history.push('/401');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadCars(), loadCarBrands(), loadTrimLevels()]);
  };

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await carApi.getAll();
      setCars(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showErrorNotification(error.message, `Ошибка загрузки автомобилей`);
    } finally {
      setLoading(false);
    }
  };

  const loadCarBrands = async () => {
    try {
      const data = await carBrandApi.getAll();
      setCarBrands(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showErrorNotification(error.message, `Ошибка загрузки марок`);
    }
  };

  const loadTrimLevels = async () => {
    try {
      const data = await trimLevelApi.getAll();
      setTrimLevels(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showErrorNotification(error.message, `Ошибка загрузки комплектаций`);
    }
  };

  // === Helper functions ===
  const getBrandName = (id: number) => carBrands.find(b => b.id === id)?.name || '—';
  const getTrimName = (id: number) => trimLevels.find(t => t.id === id)?.name || '—';

  // === Add Car ===
  const addCar = async () => {
    if (!newCar.name.trim() || !newCar.carBrandId || !newCar.trimLevelId) {
      showErrorNotification('Заполните все поля', 'Ошибка');
      return;
    }
    try {
      const data = await carApi.create({
        name: newCar.name.trim(),
        carBrandId: newCar.carBrandId,
        trimLevelId: newCar.trimLevelId,
        amount: newCar.amount,
      });
      setCars(prev => [...prev, data]);
      setNewCar({ name: '', carBrandId: null, trimLevelId: null, amount: 1 });
      showCarAddedNotification(data.name, getBrandName(data.carBrandId));
    } catch (error: any) {
      if (error.message.includes('401')) {
        authService.logout();
        return;
      }
      showErrorNotification(error.message);
    }
  };

  const deleteCar = async (id: number) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    try {
      await carApi.delete(id);
      setCars(prev => prev.filter(c => c.id !== id));
      showCarDeletedNotification(car.name, getBrandName(car.carBrandId));
    } catch (error: any) {
      if (error.message.includes('401')) {
        authService.logout();
        return;
      }
      showErrorNotification(error.message);
    }
  };

  // === Edit ===
  const openEditModal = (item: CarItem) => {
    setEditingItem(item);
    setEditingValue({
      name: item.name,
      carBrandId: item.carBrandId,
      trimLevelId: item.trimLevelId,
      amount: item.amount,
    });
    setIsModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!editingItem || !editingValue.name.trim() || !editingValue.carBrandId || !editingValue.trimLevelId) {
      showErrorNotification('Заполните все поля', 'Ошибка');
      return;
    }
    const newName = editingValue.name.trim();
    const brandName = getBrandName(editingValue.carBrandId || editingItem.carBrandId);
    
    try {
      await carApi.update(editingItem.id, {
        name: newName,
        carBrandId: editingValue.carBrandId,
        trimLevelId: editingValue.trimLevelId,
        amount: editingValue.amount,
      });
      setCars(prev => prev.map(c => 
        c.id === editingItem.id ? { 
          ...c, 
          name: editingValue.name,
          carBrandId: editingValue.carBrandId || c.carBrandId,
          trimLevelId: editingValue.trimLevelId || c.trimLevelId,
          amount: editingValue.amount 
        } : c
      ));

      // === Show notifications for changed fields ===
      if (editingItem.name !== newName) {
        showCarEditedNotification(newName, brandName, 'Название', editingItem.name, newName);
      }

      if (editingItem.carBrandId !== editingValue.carBrandId) {
        const oldBrandName = getBrandName(editingItem.carBrandId);
        const newBrandName = getBrandName(editingValue.carBrandId || editingItem.carBrandId);
        showCarEditedNotification(newName, brandName, 'Автобренд', oldBrandName, newBrandName);
      }

      if (editingItem.trimLevelId !== editingValue.trimLevelId) {
        const oldTrimName = getTrimName(editingItem.trimLevelId);
        const newTrimName = getTrimName(editingValue.trimLevelId || editingItem.trimLevelId);
        showCarEditedNotification(newName, brandName, 'Комплектация', oldTrimName, newTrimName);
      }

      if (editingItem.amount !== editingValue.amount) {
        showCarEditedNotification(newName, brandName, 'Количество', editingItem.amount, editingValue.amount);
      }

      setIsModalVisible(false);
      setEditingItem(null);
      setEditingValue({ name: '', carBrandId: null, trimLevelId: null, amount: 1 });
    } catch (error: any) {
      if (error.message.includes('401')) {
        authService.logout();
        return;
      }
      showErrorNotification(error.message);
    }
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    setEditingValue({ name: '', carBrandId: null, trimLevelId: null, amount: 1 });
  };

  // === Columns ===
  const carColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Название', dataIndex: 'name', key: 'name', width: 200, ellipsis: true },
    { 
      title: 'Автобренд', 
      key: 'carBrandName',
      width: 150,
      ellipsis: true,
      render: (_: any, record: CarItem) => getBrandName(record.carBrandId),
    },
    { 
      title: 'Комплектация', 
      key: 'trimLevelName',
      width: 150,
      ellipsis: true,
      render: (_: any, record: CarItem) => getTrimName(record.trimLevelId),
    },
    { 
      title: 'Количество', 
      dataIndex: 'amount', 
      key: 'amount',
      width: 100,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_: any, record: CarItem) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить элемент?"
            description="Это действие необратимо."
            onConfirm={() => deleteCar(record.id)}
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
        <Title level={2}>Каталог автомобилей</Title>
        <Card title="Список автомобилей" style={{ marginBottom: '20px' }}>
          <Space style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Input
              placeholder="Название"
              value={newCar.name}
              onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Выберите автобренд"
              value={newCar.carBrandId}
              onChange={(value) => setNewCar({ ...newCar, carBrandId: value })}
              style={{ width: 200 }}
              options={carBrands.map(b => ({ label: b.name, value: b.id }))}
            />
            <Select
              placeholder="Выберите комплектацию"
              value={newCar.trimLevelId}
              onChange={(value) => setNewCar({ ...newCar, trimLevelId: value })}
              style={{ width: 200 }}
              options={trimLevels.map(t => ({ label: t.name, value: t.id }))}
            />
            <InputNumber
              placeholder="Количество"
              value={newCar.amount}
              onChange={(value) => setNewCar({ ...newCar, amount: value || 1 })}
              min={1}
              style={{ width: 120 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={addCar} loading={loading}>
              Добавить
            </Button>
            <Button onClick={loadCars} loading={loading}>Обновить</Button>
          </Space>
          <Table
            columns={carColumns}
            dataSource={cars}
            rowKey="id"
            pagination={false}
            scroll={{ x: 920, y: 300 }}
            loading={loading}
          />
        </Card>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <BrandPieChart cars={cars} carBrands={carBrands} />
            <TrimBarChart cars={cars} trimLevels={trimLevels} />
          </div>
      </div>

      <Modal
        title="Редактировать автомобиль"
        open={isModalVisible}
        onOk={handleEditSave}
        onCancel={handleEditCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Название:</label>
            <Input
              placeholder="Название"
              value={editingValue.name}
              onChange={(e) => setEditingValue({ ...editingValue, name: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Автобренд:</label>
            <Select
              placeholder="Выберите автобренд"
              value={editingValue.carBrandId}
              onChange={(value) => setEditingValue({ ...editingValue, carBrandId: value })}
              options={carBrands.map(b => ({ label: b.name, value: b.id }))}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Комплектация:</label>
            <Select
              placeholder="Выберите комплектацию"
              value={editingValue.trimLevelId}
              onChange={(value) => setEditingValue({ ...editingValue, trimLevelId: value })}
              options={trimLevels.map(t => ({ label: t.name, value: t.id }))}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Количество:</label>
            <InputNumber
              placeholder="Количество"
              value={editingValue.amount}
              onChange={(value) => setEditingValue({ ...editingValue, amount: value || 1 })}
              min={1}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
