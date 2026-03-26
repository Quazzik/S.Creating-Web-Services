import React, { useEffect, useRef } from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { history } from 'umi';
import styles from './401.less';

const { Title, Paragraph } = Typography;

export default function Error403Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = React.useState(true);

  useEffect(() => {
    // Автоматически включаем звук при загрузке страницы
    if (videoRef.current) {
      // начальное состояние: видео мьютится в верстке, но снимем мута и запустим
      videoRef.current.muted = false;
      setMuted(false);

      videoRef.current.play().catch((error) => {
        console.log('Autoplay заблокирован браузером:', error);
      });
    }
  }, []);

  const handleUnmute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setMuted(newMuted);
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
        <source src="/error-401.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео
      </video>

      <div className={styles.contentOverlay}>
        <Card className={styles.errorCard}>
          <Title level={1}>401</Title>
          <Title level={2}>Unauthorized</Title>
          <Paragraph>
            Вы не  авторизованы. Пожалуйста, войдите в аккаунт для доступа к этой странице.
          </Paragraph>

          <Space style={{ marginTop: 24, gap: 16 }}>
            <Button type="primary" size="large" onClick={() => history.push('/')}>
              На главную
            </Button>
            <Button size="large" onClick={handleUnmute}>
              {muted ? '🔇 Включить звук' : '🔊 Отключить звук'}
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
