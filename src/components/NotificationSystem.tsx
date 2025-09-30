// Enhanced Notification system component with mock data
import { useState, useEffect, useCallback } from "react";
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
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MockNotification {
  id: string;
  type: "Reminder" | "Progress" | "Alert" | "Pre-Care" | "Post-Care";
  title: string;
  message: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  read: boolean;
  timestamp: string;
  patientId: string;
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
}

interface NotificationSystemProps {
  userId?: string;
  className?: string;
}

export const NotificationSystem = ({
  userId,
  className,
}: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const generateMockNotifications = useCallback((): MockNotification[] => {
    return [
      {
        id: "mock_1",
        type: "Reminder",
        title: "Appointment Tomorrow",
        message:
          "Your Abhyanga session with Dr. Meera Sharma is scheduled for tomorrow at 2:00 PM. Please arrive 15 minutes early for preparation.",
        priority: "High",
        read: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: true, sms: false },
      },
      {
        id: "mock_2",
        type: "Progress",
        title: "Weekly Progress Update",
        message:
          "Excellent progress this week! Your stress levels have improved by 15%. Continue with your Pranayama practice for best results.",
        priority: "Medium",
        read: false,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: false, sms: false },
      },
      {
        id: "mock_3",
        type: "Alert",
        title: "New Review Received",
        message:
          "Dr. Sharma has provided feedback on your recent Shirodhara session. Please review the post-treatment recommendations.",
        priority: "Medium",
        read: false,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: true, sms: false },
      },
      {
        id: "mock_4",
        type: "Reminder",
        title: "Daily Wellness Tip",
        message:
          "Start your day with warm water and lemon to support digestion. This simple Ayurvedic practice balances your Agni (digestive fire).",
        priority: "Low",
        read: true,
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: false, sms: false },
      },
      {
        id: "mock_5",
        type: "Pre-Care",
        title: "Session Preparation Reminder",
        message:
          "Remember to avoid heavy meals 2 hours before your upcoming Panchakarma session. Light, easily digestible food is recommended.",
        priority: "High",
        read: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: true, sms: true },
      },
      {
        id: "mock_6",
        type: "Alert",
        title: "Appointment Confirmation Required",
        message:
          "Please confirm your Nasya therapy session scheduled for next Tuesday at 10:00 AM.",
        priority: "Urgent",
        read: false,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: true, sms: true },
      },
      {
        id: "mock_7",
        type: "Post-Care",
        title: "Post-Treatment Care",
        message:
          "Following your Abhyanga session, remember to rest for 30 minutes and avoid cold drinks. Warm herbal tea is recommended.",
        priority: "Medium",
        read: false,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: false, sms: false },
      },
    ];
  }, [userId]);

  const loadNotifications = useCallback(() => {
    const mockNotifications = generateMockNotifications();
    setNotifications(mockNotifications);

    const unread = mockNotifications.filter((n) => !n.read);
    setUnreadCount(unread.length);
  }, [generateMockNotifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    setUnreadCount((prev) => {
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      return deletedNotification && !deletedNotification.read
        ? Math.max(0, prev - 1)
        : prev;
    });
    toast.success("Notification deleted");
  };

  useEffect(() => {
    loadNotifications();

    // Simulate new notifications arriving
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance every 30 seconds
        const newNotification: MockNotification = {
          id: `mock_${Date.now()}`,
          type: "Reminder",
          title: "Random Alert",
          message:
            "This is a randomly generated notification to demonstrate real-time updates.",
          priority: "Low",
          read: false,
          timestamp: new Date().toISOString(),
          patientId: userId || "demo-user",
          channels: { inApp: true, email: false, sms: false },
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);

        // Show toast for new notification
        toast.info("New notification received");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loadNotifications, userId]);

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
                    "p-4 border-l-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
                    getNotificationColor(
                      notification.type,
                      notification.priority
                    ),
                    !notification.read && "bg-blue-50"
                  )}
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
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1 ml-2">
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
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 px-2 text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 mt-1">
                        {notification.channels.email && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            Email
                          </span>
                        )}
                        {notification.channels.sms && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            SMS
                          </span>
                        )}
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

          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50 text-center">
              <Button variant="ghost" size="sm" className="text-xs">
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Notification Banner Component (for important alerts)
export const NotificationBanner = ({ userId }: { userId?: string }) => {
  const [bannerNotifications, setBannerNotifications] = useState<
    MockNotification[]
  >([]);

  useEffect(() => {
    // Show high/urgent priority mock notifications as banners
    const importantNotifications: MockNotification[] = [
      {
        id: "banner_1",
        type: "Alert",
        title: "Appointment Confirmation Required",
        message:
          "Please confirm your upcoming Panchakarma session scheduled for tomorrow.",
        priority: "Urgent",
        read: false,
        timestamp: new Date().toISOString(),
        patientId: userId || "demo-user",
        channels: { inApp: true, email: true, sms: true },
      },
    ];

    setBannerNotifications(importantNotifications);
  }, [userId]);

  const dismissBanner = (notificationId: string) => {
    setBannerNotifications((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );
  };

  if (bannerNotifications.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
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
              <AlertCircle className="h-4 w-4" />
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

export default NotificationSystem;
