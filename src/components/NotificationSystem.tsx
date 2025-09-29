// Notification system component for real-time alerts
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Heart,
  TrendingUp,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notificationService } from "@/lib/storage";
import { Notification } from "@/lib/data";
import { toast } from "sonner";

interface NotificationSystemProps {
  userId?: string;
  className?: string;
}

export const NotificationSystem = ({
  userId,
  className,
}: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadNotifications = () => {
    try {
      const allNotifications = userId
        ? notificationService.getByPatient(userId)
        : notificationService.getAll();

      const unread = allNotifications.filter((n) => !n.read);

      setNotifications(allNotifications.slice(0, 10)); // Show latest 10
      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const markAsRead = (notificationId: string) => {
    try {
      notificationService.markAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = () => {
    try {
      notificationService.markAllAsRead();
      loadNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "Reminder":
        return <Calendar className="h-4 w-4" />;
      case "Pre-Care":
      case "Post-Care":
        return <Heart className="h-4 w-4" />;
      case "Progress":
        return <TrendingUp className="h-4 w-4" />;
      case "Alert":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "Urgent") return "border-red-500 bg-red-50";
    if (priority === "High") return "border-orange-500 bg-orange-50";

    switch (type) {
      case "Alert":
        return "border-red-400 bg-red-50";
      case "Progress":
        return "border-green-400 bg-green-50";
      case "Reminder":
        return "border-blue-400 bg-blue-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Auto-show urgent notifications as toasts
  useEffect(() => {
    const urgentNotifications = notifications.filter(
      (n) => !n.read && n.priority === "Urgent"
    );

    urgentNotifications.forEach((notification) => {
      toast.error(notification.message, {
        duration: 10000,
        action: {
          label: "Mark Read",
          onClick: () => markAsRead(notification.id),
        },
      });
    });
  }, [notifications]);

  return (
    <div className={cn("relative", className)}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 border-l-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                    getNotificationColor(
                      notification.type,
                      notification.priority
                    ),
                    !notification.read && "bg-blue-50"
                  )}
                  onClick={() =>
                    !notification.read && markAsRead(notification.id)
                  }
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "mt-1 p-1 rounded-full",
                        notification.priority === "Urgent"
                          ? "bg-red-100 text-red-600"
                          : notification.priority === "High"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-blue-100 text-blue-600"
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              notification.priority === "Urgent"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>

                        <div className="flex items-center space-x-1">
                          {notification.channels.email && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              Email
                            </span>
                          )}
                          {notification.channels.sms && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              SMS
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Notification Banner Component (for important alerts)
export const NotificationBanner = ({ userId }: { userId?: string }) => {
  const [bannerNotifications, setBannerNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    const loadBannerNotifications = () => {
      try {
        const allNotifications = userId
          ? notificationService.getByPatient(userId)
          : notificationService.getAll();

        // Show only unread high/urgent priority notifications
        const importantUnread = allNotifications.filter(
          (n) => !n.read && (n.priority === "High" || n.priority === "Urgent")
        );

        setBannerNotifications(importantUnread.slice(0, 3)); // Max 3 banners
      } catch (error) {
        console.error("Error loading banner notifications:", error);
      }
    };

    loadBannerNotifications();

    // Refresh every minute
    const interval = setInterval(loadBannerNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const dismissBanner = (notificationId: string) => {
    try {
      notificationService.markAsRead(notificationId);
      setBannerNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error("Error dismissing banner:", error);
    }
  };

  if (bannerNotifications.length === 0) return null;

  return (
    <div className="space-y-2">
      {bannerNotifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border-l-4",
            notification.priority === "Urgent"
              ? "bg-red-50 border-red-500 text-red-800"
              : "bg-orange-50 border-orange-500 text-orange-800"
          )}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "p-1 rounded-full",
                notification.priority === "Urgent"
                  ? "bg-red-100"
                  : "bg-orange-100"
              )}
            >
              {getNotificationIcon(notification.type)}
            </div>
            <div>
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissBanner(notification.id)}
            className="text-current hover:bg-current/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

// Mock notification generator for demo purposes
export const generateMockNotification = (
  userId: string,
  type: "reminder" | "progress" | "alert" = "reminder"
) => {
  const notifications = {
    reminder: {
      type: "Reminder" as const,
      title: "Session Reminder",
      message:
        "Your Abhyanga session is scheduled for tomorrow at 2:00 PM. Please follow pre-session guidelines.",
      priority: "Medium" as const,
    },
    progress: {
      type: "Progress" as const,
      title: "Milestone Achieved!",
      message:
        "Congratulations! You have achieved your stress reduction milestone.",
      priority: "High" as const,
    },
    alert: {
      type: "Alert" as const,
      title: "Important Health Alert",
      message:
        "Please review your latest feedback response with your practitioner.",
      priority: "Urgent" as const,
    },
  };

  const notificationData = notifications[type];

  return notificationService.create({
    ...notificationData,
    read: false,
    patientId: userId,
    channels: { inApp: true, email: true, sms: type === "alert" },
  });
};
