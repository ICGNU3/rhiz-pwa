import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Notification } from '../components/NotificationCenter';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('rhiz-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rhiz-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove notifications after 7 days
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 7 * 24 * 60 * 60 * 1000);

    // Show browser notification if supported and permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/rhiz-logo-192.png',
        tag: newNotification.id
      });
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification helper functions
export const createNotification = {
  success: (title: string, message: string, category?: 'contact' | 'goal' | 'ai' | 'system' | 'network', action?: any) => ({
    type: 'success' as const,
    title,
    message,
    category,
    action
  }),
  
  error: (title: string, message: string, category?: 'contact' | 'goal' | 'ai' | 'system' | 'network', action?: any) => ({
    type: 'error' as const,
    title,
    message,
    category,
    action
  }),
  
  warning: (title: string, message: string, category?: 'contact' | 'goal' | 'ai' | 'system' | 'network', action?: any) => ({
    type: 'warning' as const,
    title,
    message,
    category,
    action
  }),
  
  info: (title: string, message: string, category?: 'contact' | 'goal' | 'ai' | 'system' | 'network', action?: any) => ({
    type: 'info' as const,
    title,
    message,
    category,
    action
  }),
  
  contact: (title: string, message: string, action?: any) => ({
    type: 'info' as const,
    title,
    message,
    category: 'contact' as const,
    action
  }),
  
  goal: (title: string, message: string, action?: any) => ({
    type: 'info' as const,
    title,
    message,
    category: 'goal' as const,
    action
  }),
  
  ai: (title: string, message: string, action?: any) => ({
    type: 'info' as const,
    title,
    message,
    category: 'ai' as const,
    action
  })
}; 