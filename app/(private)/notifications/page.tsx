"use client";

import { useSidebar } from "@/app/context/SidebarContext";
import { useNotification } from "@/app/context/NotificationContext";
import { X, AlertTriangle, CheckCircle, Eye, Bell } from "lucide-react";

export default function NotificationsPage() {
  const { isSidebarOpen } = useSidebar();
  const { notifications, markAllAsRead, markAsRead, dismissNotification } = useNotification();

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "variance_flagged":
        return "bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500";
      case "variance_approved":
        return "bg-green-50 border-green-200 border-l-4 border-l-green-500";
      case "variance_reviewed":
        return "bg-red-50 border-red-200 border-l-4 border-l-red-500";
      default:
        return "bg-blue-50 border-blue-200 border-l-4 border-l-blue-500";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "variance_flagged":
        return <Eye className="w-6 h-6 text-yellow-600" />;
      case "variance_approved":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "variance_reviewed":
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <Bell className="w-6 h-6 text-blue-600" />;
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out md:ml-64 md:w-[calc(100%-16rem)] px-20`}
    >
      <div className="mx-auto max-w-[1600px] mt-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--brand-ink)]">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {notifications.length === 0 ? "No notifications" : `You have ${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-xl bg-[var(--brand-green)] text-white px-4 py-2 font-semibold hover:opacity-90 transition-opacity"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="rounded-2xl border bg-white p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">No notifications yet</p>
              <p className="text-gray-500 mt-2">You'll see notifications here when variance is flagged or updated</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${getNotificationColor(
                    notif.type
                  )} ${notif.isRead ? "opacity-75" : "opacity-100"}`}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5 flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${notif.isRead ? "text-gray-600" : "text-[var(--brand-ink)]"}`}>
                          {notif.title}
                        </p>
                        <p className="text-gray-700 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notif.createdAt)}
                          {notif.data?.department && (
                            <span className="ml-2 font-semibold text-gray-600">
                              • {notif.data.department}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notif.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {!notif.isRead && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="text-xs text-[var(--brand-green)] hover:text-[var(--brand-green)]/80 font-semibold"
                      >
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
