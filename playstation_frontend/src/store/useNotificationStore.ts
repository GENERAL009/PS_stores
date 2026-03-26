import { create } from 'zustand';
import { toast } from 'react-toastify';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  type: NotificationType;
  message: string;
}

interface NotificationState {
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>(() => ({
  addNotification: (notification) => {
    toast[notification.type](notification.message, {
      theme: 'dark',
      position: 'bottom-right'
    });
  },
}));
