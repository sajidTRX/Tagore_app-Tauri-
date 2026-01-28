import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to Tagore",
      message: "Start writing your first note, novel, or journal entry!",
      read: false,
      timestamp: new Date().toISOString(),
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col h-screen w-full bg-[#f5e6c8]">
      {/* Header */}
      <div className="h-16 bg-[#efe6d5] border-b border-[#d4c4a8] flex items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-[#4a3f32]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-[#3d3225] ml-4">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[#8b7d6b] text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-[#a89880] mx-auto mb-4" />
              <p className="text-[#6b5d4d]">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-[#fffcf7] rounded-lg border p-4 transition-colors ${
                  notification.read
                    ? "border-[#d4c4a8]"
                    : "border-[#8b7d6b] bg-[#f8f3eb]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#3d3225]">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-[#6b5d4d] mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-[#a89880] mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                      className="text-[#6b5d4d]"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
