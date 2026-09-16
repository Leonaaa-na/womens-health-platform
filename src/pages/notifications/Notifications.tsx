import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "Period" | "Pregnancy" | "Medication" | "Appointment" | "Wellness";
  date: string;
  read: boolean;
}

const demoNotifications: Notification[] = [
  {
    id: 1,
    title: "Upcoming Appointment",
    message: "You have an appointment with Dr. Ama Mensah coming up.",
    type: "Appointment",
    date: "Today",
    read: false,
  },
  {
    id: 2,
    title: "Period Reminder",
    message: "Your expected period is approaching.",
    type: "Period",
    date: "Yesterday",
    read: false,
  },
  {
    id: 3,
    title: "Wellness Check-in",
    message: "Take a moment to record how you are feeling today.",
    type: "Wellness",
    date: "2 days ago",
    read: true,
  },
  {
    id: 4,
    title: "Medication Reminder",
    message: "Remember to check your medication schedule.",
    type: "Medication",
    date: "3 days ago",
    read: true,
  },
];

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("herbloomNotifications");

    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(demoNotifications);
      localStorage.setItem(
        "herbloomNotifications",
        JSON.stringify(demoNotifications)
      );
    }
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id: number) => {
    const updated = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    );

    setNotifications(updated);
    localStorage.setItem(
      "herbloomNotifications",
      JSON.stringify(updated)
    );
  };

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(updated);
    localStorage.setItem(
      "herbloomNotifications",
      JSON.stringify(updated)
    );
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "Period":
        return "🩸";
      case "Pregnancy":
        return "🤰";
      case "Medication":
        return "💊";
      case "Appointment":
        return "📅";
      case "Wellness":
        return "🌸";
      default:
        return "🔔";
    }
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
        {notifications.length === 0 ? (
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
                  notification.read
                    ? "bg-white"
                    : "border-l-4 border-pink-500 bg-pink-50"
                }`}
              >
                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    {getIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {notification.title}
                        </h3>

                        <span className="text-xs font-medium text-pink-500">
                          {notification.type}
                        </span>
                      </div>

                      {!notification.read && (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-500" />
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {notification.date}
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