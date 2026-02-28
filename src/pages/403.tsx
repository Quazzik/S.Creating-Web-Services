import React, { useEffect, useRef } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './403.less';

const { Title, Paragraph } = Typography;

export default function Error403Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Автоматически включаем звук при загрузке страницы
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch((error) => {
        console.log('Autoplay заблокирован браузером:', error);
      });
    }
  }, []);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <div className={styles.errorContainer}>
      <video
        ref={videoRef}
        className={styles.backgroundVideo}
        loop
        muted
        controls={false}
      >
        <source src="/error-403.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео
      </video>

      <div className={styles.contentOverlay}>
        <Card className={styles.errorCard}>
          <Title level={1}>403</Title>
          <Title level={2}>Доступ запрещен</Title>
          <Paragraph>
            К сожалению, у вас нет доступа к этой странице. Пожалуйста, вернитесь на главную страницу.
          </Paragraph>

          <Space style={{ marginTop: 24, gap: 16 }}>
            <Button type="primary" size="large" onClick={() => navigate('/')}>
              На главную
            </Button>
            <Button size="large" onClick={handleUnmute}>
              {videoRef.current?.muted ? '🔇 Включить звук' : '🔊 Отключить звук'}
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
