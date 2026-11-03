import { useCallback, useEffect, useState } from 'react';

export interface NotificationMessage {
  message: string;
  tone: 'success' | 'info';
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const dismissNotification = useCallback(() => setNotification(null), []);
  const showNotification = useCallback((message: string, tone: NotificationMessage['tone'] = 'success') => {
    setNotification({ message, tone });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timeout = window.setTimeout(dismissNotification, 4000);
    return () => window.clearTimeout(timeout);
  }, [notification, dismissNotification]);

  return { notification, showNotification, dismissNotification };
}
