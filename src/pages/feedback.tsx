import { Card, Button, Form, Input, InputNumber } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const onFinish = (values: any) => {
  console.log(values);
};

export default function Feedback() {
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
        </Card>
    </div>)}
