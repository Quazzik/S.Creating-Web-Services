import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Spin } from 'antd';
import { authService } from '../services/auth';

interface AuthModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { login: string; password: string }) => {
    setLoading(true);
    try {
      await authService.login(values.login, values.password);
      message.success('Авторизация успешна!');
      form.resetFields();
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при авторизации';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading && onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      title="Требуется авторизация"
      open={visible}
      onCancel={handleCancel}
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      footer={null}
      centered
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="login"
            label="Логин"
            rules={[
              { required: true, message: 'Пожалуйста, введите логин' },
            ]}
          >
            <Input placeholder="Введите логин" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль' },
            ]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AuthModal;
