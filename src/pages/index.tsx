import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <Card>
      <Title level={2}>Добро пожаловать в мое приложение!</Title>
      <Paragraph>
        <Title level={3}>Это первая страница, созданная с использованием umiJS и Ant Design.</Title>
        <p>Здесь ничего нет, попробуйте посмотреть раздел "О программе"</p>
      </Paragraph>
    </Card>
  );
}