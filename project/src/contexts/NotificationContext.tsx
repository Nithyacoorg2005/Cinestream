import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cinestream_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }

    // Add some initial notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to CineStream!',
        message: 'Discover thousands of movies and series',
        type: 'info',
        timestamp: new Date(),
        read: false,
        icon: '🎬'
      },
      {
        id: '2',
        title: 'New Release Alert',
        message: 'The Quantum Heist is now available!',
        type: 'info',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        actionUrl: '/movie/1',
        icon: '🆕'
      }
    ];

    if (!stored) {
      setNotifications(initialNotifications);
      localStorage.setItem('cinestream_notifications', JSON.stringify(initialNotifications));
    }
  }, []);

  const saveNotifications = (newNotifications: Notification[]) => {
    localStorage.setItem('cinestream_notifications', JSON.stringify(newNotifications));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Keep only last 50
      saveNotifications(updated);
      return updated;
    });

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      saveNotifications(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      saveNotifications(updated);
      return updated;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(notif => notif.id !== id);
      saveNotifications(updated);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('cinestream_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};