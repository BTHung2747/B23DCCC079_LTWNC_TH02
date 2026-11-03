import type { NotificationMessage } from '../hooks/useThongBao';

interface NotificationProps {
  notification: NotificationMessage | null;
  onDismiss: () => void;
}

export default function Notification({ notification, onDismiss }: NotificationProps) {
  if (!notification) return null;
  return (
    <div className={`toast toast-${notification.tone}`} role="status" aria-live="polite" aria-atomic="true">
      <span className="toast-symbol" aria-hidden="true">{notification.tone === 'success' ? '✓' : 'i'}</span>
      <p>{notification.message}</p>
      <button className="toast-close" type="button" aria-label="Đóng thông báo" onClick={onDismiss}>×</button>
    </div>
  );
}
