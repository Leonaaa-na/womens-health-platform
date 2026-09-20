import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUpcomingReminders, type HerBloomReminder, getIconForType } from "../../services/reminderService";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
}

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const reminders = await fetchUpcomingReminders();
        const mapped: Notification[] = reminders.map((r: HerBloomReminder) => ({
          id: r.id,
          title: r.title,
          message: r.notes || "",
          type: r.type,
          date: r.date,
          read: r.completed,
        }));
        setNotifications(mapped);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `in ${diffDays} days`;
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/appointments")}
              className="mb-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              🔔 Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Stay updated with important HerBloom reminders and activities.
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mb-5 flex justify-between rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-600">
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications */}
        {loading ? (
          <div className="text-center py-12">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mb-3 text-5xl">🔔</div>
            <h2 className="font-bold text-gray-800">
              No notifications
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              You are all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`w-full rounded-2xl p-5 text-left shadow-sm transition hover:shadow-md ${
                  notification.read ? "bg-white" : "border-l-4 border-pink-500 bg-pink-50"
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {notification.title}
                        </h3>
                        <span className="text-xs font-medium text-pink-500 capitalize">
                          {notification.type}
                        </span>
                      </div>
                      {!notification.read && (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-500" />
                      )}
                    </div>
                    {notification.message && (
                      <p className="mt-2 text-sm text-gray-600">
                        {notification.message}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      {getDisplayDate(notification.date)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
