import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface NotificationSettingsData {
  notificationsEnabled: boolean;
  periodEnabled: boolean;
  pregnancyEnabled: boolean;
  medicationEnabled: boolean;
  appointmentEnabled: boolean;
  wellnessEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderTiming: string;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}

const defaultSettings: NotificationSettingsData = {
  notificationsEnabled: true,
  periodEnabled: true,
  pregnancyEnabled: true,
  medicationEnabled: true,
  appointmentEnabled: true,
  wellnessEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  reminderTiming: "15",
  quietHoursEnabled: false,
  quietStart: "22:00",
  quietEnd: "07:00",
};

function NotificationSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] =
    useState<NotificationSettingsData>(defaultSettings);

  const [permission, setPermission] =
    useState<NotificationPermission | "unsupported">("unsupported");

  useEffect(() => {
    const saved = localStorage.getItem(
      "herbloomNotificationSettings"
    );

    if (saved) {
      setSettings({
        ...defaultSettings,
        ...JSON.parse(saved),
      });
    }

    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const updateSettings = (
    key: keyof NotificationSettingsData,
    value: boolean | string
  ) => {
    setSettings((current) => {
      const updated = {
        ...current,
        [key]: value,
      };

      localStorage.setItem(
        "herbloomNotificationSettings",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert(
        "Your current browser does not support device notifications."
      );
      return;
    }

    try {
      const result = await Notification.requestPermission();

      setPermission(result);

      if (result === "granted") {
        alert("HerBloom notifications have been enabled on this device.");
      } else if (result === "denied") {
        alert(
          "Notifications were blocked. You can enable them from your device or browser settings."
        );
      }
    } catch {
      alert("Unable to request notification permission.");
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      "herbloomNotificationSettings",
      JSON.stringify(defaultSettings)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <button
          onClick={() => navigate("/notifications")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back to Notifications
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 text-4xl">⚙️</div>

          <h1 className="text-3xl font-bold text-gray-800">
            Notification Settings
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Choose which HerBloom notifications you want to receive
            and how reminders should behave.
          </p>
        </div>

        {/* Device Notifications */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">

          <h2 className="mb-1 text-lg font-bold text-gray-800">
            📱 Device Notifications
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Allow HerBloom to send notifications to your device.
          </p>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-pink-50 p-4">

            <div>
              <p className="font-semibold text-gray-800">
                Phone Notifications
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {permission === "granted"
                  ? "Notifications are allowed on this device."
                  : permission === "denied"
                  ? "Notifications are currently blocked."
                  : "Allow HerBloom to request notification permission."}
              </p>
            </div>

            {permission === "granted" ? (
              <span className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
                Enabled
              </span>
            ) : (
              <button
                onClick={requestNotificationPermission}
                className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
              >
                Enable
              </button>
            )}

          </div>
        </section>

        {/* Main Notifications */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                🔔 Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Turn HerBloom notifications on or off.
              </p>
            </div>

            <button
              onClick={() =>
                updateSettings(
                  "notificationsEnabled",
                  !settings.notificationsEnabled
                )
              }
              className={`relative h-7 w-12 rounded-full transition ${
                settings.notificationsEnabled
                  ? "bg-pink-500"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  settings.notificationsEnabled
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

        </section>

        {/* Notification Types */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">

          <h2 className="mb-4 text-lg font-bold text-gray-800">
            📋 Notification Types
          </h2>

          <div className="space-y-3">

            {[
              {
                key: "periodEnabled" as const,
                icon: "🩸",
                title: "Period Reminders",
                description: "Expected period and cycle reminders.",
              },
              {
                key: "pregnancyEnabled" as const,
                icon: "🤰",
                title: "Pregnancy Reminders",
                description: "Pregnancy milestones and health reminders.",
              },
              {
                key: "medicationEnabled" as const,
                icon: "💊",
                title: "Medication Reminders",
                description: "Reminders for your medication schedule.",
              },
              {
                key: "appointmentEnabled" as const,
                icon: "📅",
                title: "Appointment Reminders",
                description: "Upcoming appointment notifications.",
              },
              {
                key: "wellnessEnabled" as const,
                icon: "🌸",
                title: "Wellness Reminders",
                description: "Wellness activities and check-ins.",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-xl">
                    {item.icon}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.description}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() =>
                    updateSettings(
                      item.key,
                      !settings[item.key]
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    settings[item.key]
                      ? "bg-pink-500"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Toggle ${item.title}`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      settings[item.key]
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}

          </div>
        </section>

        {/* Notification Behavior */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">

          <h2 className="mb-4 text-lg font-bold text-gray-800">
            📳 Notification Behavior
          </h2>

          <div className="space-y-4">

            {/* Sound */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">
                  🔊 Notification Sound
                </p>

                <p className="text-xs text-gray-500">
                  Play a sound when a notification arrives.
                </p>
              </div>

              <button
                onClick={() =>
                  updateSettings(
                    "soundEnabled",
                    !settings.soundEnabled
                  )
                }
                className={`relative h-7 w-12 rounded-full ${
                  settings.soundEnabled
                    ? "bg-pink-500"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${
                    settings.soundEnabled
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">
                  📳 Vibration
                </p>

                <p className="text-xs text-gray-500">
                  Vibrate when a reminder arrives.
                </p>
              </div>

              <button
                onClick={() =>
                  updateSettings(
                    "vibrationEnabled",
                    !settings.vibrationEnabled
                  )
                }
                className={`relative h-7 w-12 rounded-full ${
                  settings.vibrationEnabled
                    ? "bg-pink-500"
                    : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${
                    settings.vibrationEnabled
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </div>

          </div>
        </section>

        {/* Reminder Timing */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">

          <h2 className="mb-2 text-lg font-bold text-gray-800">
            ⏰ Reminder Timing
          </h2>

          <p className="mb-4 text-sm text-gray-500">
            Choose how early HerBloom should remind you.
          </p>

          <select
            value={settings.reminderTiming}
            onChange={(event) =>
              updateSettings(
                "reminderTiming",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          >
            <option value="0">At the scheduled time</option>
            <option value="5">5 minutes before</option>
            <option value="10">10 minutes before</option>
            <option value="15">15 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
            <option value="1440">1 day before</option>
          </select>

        </section>

        {/* Quiet Hours */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                🌙 Quiet Hours
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Pause non-urgent notifications during selected hours.
              </p>
            </div>

            <button
              onClick={() =>
                updateSettings(
                  "quietHoursEnabled",
                  !settings.quietHoursEnabled
                )
              }
              className={`relative h-7 w-12 shrink-0 rounded-full ${
                settings.quietHoursEnabled
                  ? "bg-purple-500"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${
                  settings.quietHoursEnabled
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {settings.quietHoursEnabled && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Start
                </label>

                <input
                  type="time"
                  value={settings.quietStart}
                  onChange={(event) =>
                    updateSettings(
                      "quietStart",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  End
                </label>

                <input
                  type="time"
                  value={settings.quietEnd}
                  onChange={(event) =>
                    updateSettings(
                      "quietEnd",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400"
                />
              </div>

            </div>
          )}

        </section>

        {/* Reset */}
        <button
          onClick={resetSettings}
          className="w-full rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200"
        >
          Reset Notification Settings
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          HerBloom notification preferences are saved on this device.
          Full background notifications will be connected to the
          HerBloom backend and mobile notification system later.
        </p>

      </div>
    </div>
  );
}

export default NotificationSettings;