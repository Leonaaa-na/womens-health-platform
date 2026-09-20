import { useEffect, useState } from "react";

interface Reminder {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  category: string;
  completed?: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  period: boolean;
  symptoms: boolean;
  medication: boolean;
  appointments: boolean;
  pregnancy: boolean;
  wellness: boolean;
  sound: boolean;
  vibration: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  period: true,
  symptoms: true,
  medication: true,
  appointments: true,
  pregnancy: true,
  wellness: true,
  sound: true,
  vibration: true,
};

function NotificationPopup() {
  const [reminder, setReminder] =
    useState<Reminder | null>(null);

  const [visible, setVisible] = useState(false);

  const getSettings = (): NotificationSettings => {
    try {
      const saved = localStorage.getItem(
        "herbloomNotificationSettings"
      );

      if (!saved) {
        return DEFAULT_SETTINGS;
      }

      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  };

  const getReminders = (): Reminder[] => {
    try {
      const saved = localStorage.getItem(
        "herbloomReminders"
      );

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const categoryEnabled = (
    category: string,
    settings: NotificationSettings
  ) => {
    const value = category.toLowerCase();

    if (value.includes("period")) {
      return settings.period;
    }

    if (value.includes("symptom")) {
      return settings.symptoms;
    }

    if (value.includes("medication")) {
      return settings.medication;
    }

    if (value.includes("appointment")) {
      return settings.appointments;
    }

    if (value.includes("pregnancy")) {
      return settings.pregnancy;
    }

    if (value.includes("wellness")) {
      return settings.wellness;
    }

    return true;
  };

  const showBrowserNotification = (
    currentReminder: Reminder,
    settings: NotificationSettings
  ) => {
    if (
      !settings.enabled ||
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      return;
    }

    if (Notification.permission !== "granted") {
      return;
    }

    try {
      new Notification(currentReminder.title, {
        body:
          currentReminder.description ||
          "You have a HerBloom reminder.",
      });
    } catch {
      // Browser notification failed.
    }
  };

  const triggerReminder = () => {
    const settings = getSettings();

    if (!settings.enabled) {
      return;
    }

    const reminders = getReminders();

    if (reminders.length === 0) {
      return;
    }

    const now = new Date();

    const currentDate = now
      .toISOString()
      .split("T")[0];

    const currentHours = String(
      now.getHours()
    ).padStart(2, "0");

    const currentMinutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    const currentTime = `${currentHours}:${currentMinutes}`;

    const dueReminder = reminders.find(
      (item) => {
        if (item.completed) {
          return false;
        }

        if (item.date !== currentDate) {
          return false;
        }

        if (!item.time) {
          return false;
        }

        const reminderTime =
          item.time.length >= 5
            ? item.time.substring(0, 5)
            : item.time;

        if (reminderTime !== currentTime) {
          return false;
        }

        return categoryEnabled(
          item.category,
          settings
        );
      }
    );

    if (!dueReminder) {
      return;
    }

    setReminder(dueReminder);
    setVisible(true);

    showBrowserNotification(
      dueReminder,
      settings
    );

    if (
      settings.vibration &&
      "vibrate" in navigator
    ) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Vibration is not available.
      }
    }
  };

  const markComplete = () => {
    if (!reminder) {
      return;
    }

    const reminders = getReminders();

    const updated = reminders.map(
      (item) =>
        item.id === reminder.id
          ? {
              ...item,
              completed: true,
            }
          : item
    );

    localStorage.setItem(
      "herbloomReminders",
      JSON.stringify(updated)
    );

    setVisible(false);
    setReminder(null);
  };

  const dismiss = () => {
    setVisible(false);
    setReminder(null);
  };

  useEffect(() => {
    triggerReminder();

    const interval = window.setInterval(
      triggerReminder,
      60000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  if (!visible || !reminder) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xl">
              🔔
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                HerBloom Reminder
              </p>

              <h3 className="mt-1 font-bold text-gray-900">
                {reminder.title}
              </h3>
            </div>

          </div>

          <button
            type="button"
            onClick={dismiss}
            className="text-xl text-gray-400 hover:text-gray-600"
            aria-label="Dismiss notification"
          >
            ×
          </button>

        </div>

        {/* Message */}
        <p className="mt-4 text-sm leading-6 text-gray-600">
          {reminder.description ||
            "You have a reminder scheduled for now."}
        </p>

        {/* Category */}
        {reminder.category && (
          <div className="mt-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {reminder.category}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3">

          <button
            type="button"
            onClick={dismiss}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Later
          </button>

          <button
            type="button"
            onClick={markComplete}
            className="flex-1 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
          >
            Mark Complete
          </button>

        </div>

      </div>
    </div>
  );
}

export default NotificationPopup;