import { useEffect, useState } from "react";
import apiClient, { ApiErrorResponse } from "../api/client";
import {
  fetchReminders,
  toggleReminderComplete,
  type HerBloomReminder,
} from "../services/reminderService";

interface Reminder {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  notes: string;
  completed: boolean;
  automatic?: boolean;
}

interface NotificationSettings {
  notificationsEnabled: boolean;
  periodNotifications: boolean;
  pregnancyNotifications: boolean;
  medicationNotifications: boolean;
  appointmentNotifications: boolean;
  wellnessNotifications: boolean;
  notificationSound: boolean;
  vibration: boolean;
}

const defaultSettings: NotificationSettings = {
  notificationsEnabled: true,
  periodNotifications: true,
  pregnancyNotifications: true,
  medicationNotifications: true,
  appointmentNotifications: true,
  wellnessNotifications: true,
  notificationSound: true,
  vibration: true,
};

const NotificationPopup = () => {
  const [notification, setNotification] = useState<Reminder | null>(null);

  useEffect(() => {
    const loadDueReminder = async () => {
      try {
        const settingsResponse = await apiClient.get<NotificationSettings>("/users/notification-settings");
        let resolvedSettings = defaultSettings;
        if (settingsResponse.data.success) {
          const merged = { ...defaultSettings, ...settingsResponse.data.data };
          resolvedSettings = merged;
        }

        if (!resolvedSettings.notificationsEnabled) {
          return;
        }

        const reminders: HerBloomReminder[] = await fetchReminders({ upcoming: "true" });

        const today = new Date().toISOString().split("T")[0];
        const currentTime = new Date();

        const enabledTypes: Record<string, boolean> = {
          period: resolvedSettings.periodNotifications,
          pregnancy: resolvedSettings.pregnancyNotifications,
          medication: resolvedSettings.medicationNotifications,
          appointment: resolvedSettings.appointmentNotifications,
          wellness: resolvedSettings.wellnessNotifications,
          custom: true,
        };

        const dueReminder = reminders.find((reminder) => {
          if (reminder.completed) return false;
          if (reminder.date !== today) return false;
          if (enabledTypes[reminder.type] === false) return false;

          if (!reminder.time) return true;

          const reminderDate = new Date(`${reminder.date}T${reminder.time}`);
          return reminderDate <= currentTime;
        });

        if (dueReminder) {
          const mapped: Reminder = {
            id: dueReminder.id,
            title: dueReminder.title,
            type: dueReminder.type,
            date: dueReminder.date,
            time: dueReminder.time,
            notes: dueReminder.notes,
            completed: dueReminder.completed,
            automatic: dueReminder.automatic,
          };
          setNotification(mapped);

          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("HerBloom Reminder", {
              body: dueReminder.title,
            });
          }

          if (resolvedSettings.vibration && "vibrate" in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        }
      } catch {
        // Gracefully ignore — no due reminder or offline
      }
    };

    loadDueReminder();

    const interval = window.setInterval(loadDueReminder, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  if (!notification) {
    return null;
  }

  const dismissNotification = () => {
    setNotification(null);
  };

  const markAsCompleted = async () => {
    try {
      await toggleReminderComplete(notification.id);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: ApiErrorResponse } };
      if (apiError?.response?.status === 401) {
        // session expired — popup will be dismissed on logout
      }
    }
    setNotification(null);
  };

  return (
    <div className="fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div className="rounded-2xl border border-pink-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-xl">
              🔔
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-500">
                HerBloom Reminder
              </p>

              <h3 className="mt-1 font-bold text-gray-800">
                {notification.title}
              </h3>
            </div>
          </div>

          <button
            onClick={dismissNotification}
            className="text-xl text-gray-400 hover:text-gray-600"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-pink-50 p-3">
          <p className="text-sm text-gray-600">
            {notification.notes}
          </p>

          <p className="mt-2 text-xs font-medium text-pink-600">
            {notification.type} • {notification.time}
          </p>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={markAsCompleted}
            className="flex-1 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-pink-600"
          >
            Mark Complete
          </button>

          <button
            onClick={dismissNotification}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
