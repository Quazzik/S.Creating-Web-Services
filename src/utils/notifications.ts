import { notification } from 'antd';

export const showAddNotification = (dictionaryName: string, itemName: string, count: number) => {
  notification.success({
    message: 'Элемент добавлен',
    description: `Текущее количество ${dictionaryName}: ${count}, добавлен новый элемент: ${itemName}`,
    duration: 4,
  });
};

export const showDeleteNotification = (dictionaryName: string, itemName: string, count: number) => {
  notification.info({
    message: 'Элемент удалён',
    description: `Текущее количество ${dictionaryName}: ${count}, удалён элемент: ${itemName}`,
    duration: 4,
  });
};