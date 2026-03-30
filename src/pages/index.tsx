import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <Card>
      <Title level={2}>Добро пожаловать в мое приложение!</Title>
      <Paragraph>
        <Title level={3}>Это первая страница, созданная с использованием umiJS и Ant Design.</Title>
        <p>Здесь так же имеется взаимодействия с  API. Для корректной работы необходимо скачать с <a href="https://github.com/Quazzik/CarAPI">GitHub</a> и запустить сервер на порту 5212 </p>
        <p>Базовые справочники уже заполнены, находятся в том же репозитории в базе sqlite. Логин/пароль: Login/Password</p>
      </Paragraph>
    </Card>
  );
}