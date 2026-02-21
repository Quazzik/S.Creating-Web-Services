import { Card, Modal } from 'antd';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

export default function FeedbackModal({ open, onClose, data }: FeedbackModalProps) {
  const buildFeedbackText = (data: any) => {
    let text = `Имя: ${data?.user?.name}\n`;
    text += `Почта: ${data?.user?.email}\n`;
    if (data?.user?.introduction) {
      text += `Ваш текст обращения: ${data.user.introduction}`;
    } else {
      text += "Ваш текст обращения пуст, видимо вы решили молча передать свои данные нашей службе безопасности, спасибо";
    }
    return text;
  };

  return (
    <Modal title="Обратная связь отправлена:" open={open} onCancel={onClose} footer={null}>
      <Card>
        <p style={{ whiteSpace: 'pre-wrap' }}>{buildFeedbackText(data)}</p>
      </Card>
    </Modal>
  );
}