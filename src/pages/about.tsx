import React, { useState } from 'react';
import { Button, Card, Typography, Space, Modal, Image } from 'antd';

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card>
      <Title level={2}>О программе</Title>
      <Paragraph>
        Это учебное приложение, созданное в рамках практического задания.
      </Paragraph>
      
      <Space style={{ marginTop: 20 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Показать ту самую фотографию
        </Button>
      </Space>
      
      <Modal
        title="Фотография, прикольная, Grok нарисовал"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Image
          src="/image.jpg"
          alt="Фотография, но не разработчика"
          style={{ width: '100%', borderRadius: 8 }}
        />
      </Modal>
    </Card>
  );
}