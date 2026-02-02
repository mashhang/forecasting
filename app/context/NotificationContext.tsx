"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

export interface Notification {
  id: string;
  type: "variance_flagged" | "variance_approved" | "variance_reviewed" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: {
    department?: string;
    variance?: number;
    status?: "Approved" | "For Review" | "Disapproved";
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    type: Notification["type"],
    title: string,
    message: string,
    data?: Notification["data"]
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        // Parse notifications and restore Date objects
        const parsed = JSON.parse(savedNotifications) as Notification[];
        const restored = parsed.map((notif) => ({
          ...notif,
          createdAt: new Date(notif.createdAt),
        }));
        setNotifications(restored);
      }
    } catch (error) {
      console.error('Failed to load notifications from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error('Failed to save notifications to localStorage:', error);
      }
    }
  }, [notifications, isHydrated]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addNotification = useCallback(
    (
      type: Notification["type"],
      title: string,
      message: string,
      data?: Notification["data"]
    ) => {
      const id = `notif_${Date.now()}_${Math.random()}`;
      const newNotification: Notification = {
        id,
        type,
        title,
        message,
        isRead: false,
        createdAt: new Date(),
        data,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.removeItem('notifications');
    } catch (error) {
      console.error('Failed to clear notifications from localStorage:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
