import { Card, Button, Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import FeedbackModal from '@/components/FeedbackModal';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: 'Поле "${label}" необходимо  заполнить!',
  types: {
    email: 'Такая ${label} не может существовать!',
  },
};

export default function Feedback() {
  const [visible, setVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const onFinish = (values: any) => {
    console.log('onFinish called', values);
    setSubmittedData(values);
    setVisible(true);
  };

  return (
    <div>
        <Card>
            <Form
    {...layout}
    name="nest-messages"
    onFinish={onFinish}
    style={{ maxWidth: 600 }}
    validateMessages={validateMessages}
  >
    <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
      <h1>Обратная связь</h1>
    </Form.Item>
    <Form.Item name={['user', 'name']} label="Имя" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name={['user', 'email']} label="Почта" rules={[{ type: 'email', required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name={['user', 'introduction']} label="Ваш текст обращения">
      <Input.TextArea />
    </Form.Item>
    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Отправить
      </Button>
    </Form.Item>
  </Form>
        <FeedbackModal open={visible} onClose={() => setVisible(false)} data={submittedData} />
        </Card>
    </div>)}


