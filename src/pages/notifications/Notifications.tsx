import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
  notificationLink,
  typeIcon,
  typeLabel,
  timeAgo,
  apiErrorMessage,
  type AppNotification,
} from "../../api/reminderApi";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setNotifications(await getNotifications());
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const openNotification = async (n: AppNotification) => {
    if (!n.isRead) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      markNotificationRead(n.id).catch(() => undefined);
    }
    const link = notificationLink(n);
    if (link) navigate(link);
  };

  const markAllAsRead = async () => {
    const previous = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch (error) {
      setNotifications(previous);
      setMessage(apiErrorMessage(error, "Could not update notifications."));
    }
  };

  const removeOne = async (id: string) => {
    const previous = notifications;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotification(id);
    } catch (error) {
      setNotifications(previous);
      setMessage(apiErrorMessage(error, "Could not delete notification."));
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Clear all notifications? This can't be undone.")) return;
    const previous = notifications;
    setNotifications([]);
    try {
      await clearNotifications();
    } catch (error) {
      setNotifications(previous);
      setMessage(apiErrorMessage(error, "Could not clear notifications."));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">🔔 Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">Stay updated with important HerBloom reminders and activities.</p>
          </div>
          {unreadCount > 0 ? (
            <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">{unreadCount} unread</span>
          ) : null}
        </div>

        {/* Shortcuts */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/notifications/reminders")}
            className="rounded-2xl bg-white p-4 text-left shadow-md transition hover:shadow-lg"
          >
            <p className="text-2xl">📋</p>
            <p className="mt-2 font-semibold text-gray-800">My Reminders</p>
            <p className="text-xs text-gray-500">Create and manage reminders</p>
          </button>
          <button
            onClick={() => navigate("/notifications/settings")}
            className="rounded-2xl bg-white p-4 text-left shadow-md transition hover:shadow-lg"
          >
            <p className="text-2xl">⚙️</p>
            <p className="mt-2 font-semibold text-gray-800">Settings</p>
            <p className="text-xs text-gray-500">Choose what you receive</p>
          </button>
        </div>

        {/* Actions */}
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-white p-4 shadow-md">
          <p className="text-sm text-gray-600">
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-4">
            {unreadCount > 0 ? (
              <button onClick={markAllAsRead} className="text-sm font-semibold text-pink-600 hover:text-pink-700">
                Mark all as read
              </button>
            ) : null}
            {notifications.length > 0 ? (
              <button onClick={clearAll} className="text-sm font-semibold text-gray-400 hover:text-red-500">
                Clear all
              </button>
            ) : null}
          </div>
        </div>

        {message ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{message}</div> : null}

        {/* List */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mb-3 text-5xl">🔔</div>
            <h2 className="font-bold text-gray-800">No notifications</h2>
            <p className="mt-1 text-sm text-gray-500">
              You are all caught up! Reminders, appointment updates and community activity will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-4 rounded-2xl p-5 shadow-sm transition hover:shadow-md ${
                  n.isRead ? "bg-white" : "border-l-4 border-pink-500 bg-pink-50"
                }`}
              >
                <button type="button" onClick={() => openNotification(n)} className="flex min-w-0 flex-1 gap-4 text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    {typeIcon(n.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{n.title}</h3>
                        <span className="text-xs font-medium text-pink-500">{typeLabel(n.type)}</span>
                      </div>
                      {!n.isRead ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-500" /> : null}
                    </div>
                    {n.body ? <p className="mt-2 text-sm text-gray-600">{n.body}</p> : null}
                    <p className="mt-2 text-xs text-gray-400">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => removeOne(n.id)}
                  className="self-start text-sm text-gray-300 hover:text-red-500"
                  aria-label="Delete notification"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;