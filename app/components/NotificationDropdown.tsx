'use client';

import { useRef, useEffect, useState } from 'react';
import { useNotification } from '@/app/context/NotificationContext';
import { Bell, X, CheckCheck, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } =
    useNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'variance_flagged':
        return 'bg-yellow-50 border-yellow-200';
      case 'variance_approved':
        return 'bg-green-50 border-green-200';
      case 'variance_reviewed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'variance_flagged':
        return <Eye className="w-5 h-5 text-yellow-600" />;
      case 'variance_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'variance_reviewed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 mt-2 w-80 bg-white rounded-xl border shadow-lg z-50 transition-all duration-200 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-[var(--brand-ink)]">Notifications</h3>
        {unreadCount > 0 && (
          <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 border-l-4 transition-colors duration-200 ${
                  notif.isRead
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-[var(--brand-green)]'
                } ${getNotificationColor(notif.type)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 cursor-pointer">
                    <div className="mt-0.5 flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                    <div
                      className="flex-1"
                      onClick={() => !notif.isRead && markAsRead(notif.id)}
                    >
                      <p className={`text-sm font-semibold ${notif.isRead ? 'text-gray-600' : 'text-[var(--brand-ink)]'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t px-4 py-2 flex gap-2">
          <button
            onClick={markAllAsRead}
            className="flex-1 text-sm text-[var(--brand-green)] hover:text-[var(--brand-green)]/80 font-semibold py-2 flex items-center justify-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Format notification time
 * Shows "just now", "5m ago", "1h ago", or date
 */
function formatTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
