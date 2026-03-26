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

export const showEditNotification = (dictionaryName: string, oldName: string, newName: string) => {
  notification.info({
    message: 'Элемент изменён',
    description: `В ${dictionaryName} элемент "${oldName}" изменён на "${newName}"`,
    duration: 4,
  });
};

export const showLogoutNotification = () => {
  notification.info({
    message: 'Сессия завершена. Пожалуйста, войдите снова.',
    duration: 4,
  });
};

export const showLoginNotification = (username: any) => {
  notification.success({
    message: `Добро пожаловать, ${username}!`,
    duration: 4,
  });
};

export const showErrorNotification = (error: string, withMessage: string | null = "Ошибка") => {
  notification.error({
    message: withMessage,
    description: error,
    duration: 4,
  });
};