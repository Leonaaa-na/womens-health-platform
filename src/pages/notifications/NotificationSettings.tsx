import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotificationSettings,
  updateNotificationSettings,
  apiErrorMessage,
  DEFAULT_SETTINGS,
  type NotificationSettings as Settings,
} from "../../api/reminderApi";

const TYPE_TOGGLES: { key: keyof Settings; icon: string; title: string; description: string }[] = [
  { key: "periodNotifications", icon: "🩸", title: "Period Reminders", description: "Expected period and cycle reminders." },
  { key: "pregnancyNotifications", icon: "🤰", title: "Pregnancy Reminders", description: "Pregnancy milestones and health reminders." },
  { key: "medicationNotifications", icon: "💊", title: "Medication Reminders", description: "Reminders for your medication schedule." },
  { key: "appointmentNotifications", icon: "📅", title: "Appointment Reminders", description: "Upcoming appointment notifications." },
  { key: "wellnessNotifications", icon: "🌸", title: "Wellness Reminders", description: "Wellness activities and check-ins." },
];

function Toggle({ on, onClick, color = "bg-pink-500", label }: { on: boolean; onClick: () => void; color?: string; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? color : "bg-gray-300"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

function NotificationSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  useEffect(() => {
    const load = async () => {
      try {
        setSettings(await getNotificationSettings());
      } catch {
        setMessage("Could not load your settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  // Save each change straight away; undo it if the server says no
  const save = async (changes: Partial<Settings>) => {
    const previous = settings;
    setSettings({ ...settings, ...changes });
    setMessage("");
    try {
      await updateNotificationSettings(changes);
    } catch (error) {
      setSettings(previous);
      setMessage(apiErrorMessage(error, "Could not save that change."));
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      setMessage("Your current browser does not support device notifications.");
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "denied") setMessage("Notifications were blocked. You can enable them in your browser settings.");
    } catch {
      setMessage("Unable to request notification permission.");
    }
  };

  const resetSettings = async () => {
    if (!window.confirm("Reset all notification settings to default?")) return;
    const previous = settings;
    setSettings(DEFAULT_SETTINGS);
    try {
      await updateNotificationSettings(DEFAULT_SETTINGS);
      setMessage("Settings reset to default.");
    } catch (error) {
      setSettings(previous);
      setMessage(apiErrorMessage(error, "Could not reset settings."));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  const off = !settings.notificationsEnabled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate("/notifications")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back to Notifications
        </button>

        <div className="mb-6">
          <div className="mb-3 text-4xl">⚙️</div>
          <h1 className="text-3xl font-bold text-gray-800">Notification Settings</h1>
          <p className="mt-2 text-sm text-gray-500">
            Choose which HerBloom notifications you want to receive and how reminders should behave. Changes save automatically.
          </p>
        </div>

        {message ? <div className="mb-5 rounded-xl bg-pink-50 p-3 text-sm font-medium text-pink-700">{message}</div> : null}

        {/* Device Notifications */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">
          <h2 className="mb-1 text-lg font-bold text-gray-800">📱 Device Notifications</h2>
          <p className="mb-4 text-sm text-gray-500">Allow this browser to show HerBloom notifications.</p>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-pink-50 p-4">
            <div>
              <p className="font-semibold text-gray-800">Browser Notifications</p>
              <p className="mt-1 text-xs text-gray-500">
                {permission === "granted"
                  ? "Notifications are allowed on this device."
                  : permission === "denied"
                  ? "Notifications are currently blocked."
                  : "Allow HerBloom to request notification permission."}
              </p>
            </div>
            {permission === "granted" ? (
              <span className="rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-700">Enabled</span>
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

        {/* Master switch */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">🔔 Notifications</h2>
              <p className="mt-1 text-sm text-gray-500">Turn all HerBloom reminder notifications on or off.</p>
            </div>
            <Toggle
              on={settings.notificationsEnabled}
              onClick={() => save({ notificationsEnabled: !settings.notificationsEnabled })}
              label="Toggle notifications"
            />
          </div>
        </section>

        {/* Types */}
        <section className={`mb-5 rounded-2xl bg-white p-5 shadow-md ${off ? "opacity-50" : ""}`}>
          <h2 className="mb-4 text-lg font-bold text-gray-800">📋 Notification Types</h2>
          <div className="space-y-3">
            {TYPE_TOGGLES.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-xl">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <Toggle
                  on={!!settings[item.key]}
                  onClick={() => save({ [item.key]: !settings[item.key] } as Partial<Settings>)}
                  label={`Toggle ${item.title}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Behaviour */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">
          <h2 className="mb-4 text-lg font-bold text-gray-800">📳 Notification Behavior</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">🔊 Notification Sound</p>
                <p className="text-xs text-gray-500">Play a sound when a notification arrives.</p>
              </div>
              <Toggle
                on={settings.notificationSound}
                onClick={() => save({ notificationSound: !settings.notificationSound })}
                label="Toggle sound"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">📳 Vibration</p>
                <p className="text-xs text-gray-500">Vibrate when a reminder arrives.</p>
              </div>
              <Toggle
                on={settings.vibration}
                onClick={() => save({ vibration: !settings.vibration })}
                label="Toggle vibration"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-800">✉️ Email Updates</p>
                <p className="text-xs text-gray-500">Appointment confirmations and account emails.</p>
              </div>
              <Toggle
                on={settings.emailNotifications}
                onClick={() => save({ emailNotifications: !settings.emailNotifications })}
                label="Toggle email"
              />
            </div>
          </div>
        </section>

        {/* Timing */}
        <section className="mb-5 rounded-2xl bg-white p-5 shadow-md">
          <h2 className="mb-2 text-lg font-bold text-gray-800">⏰ Reminder Timing</h2>
          <p className="mb-4 text-sm text-gray-500">Choose how early HerBloom should remind you.</p>
          <select
            value={String(settings.reminderLeadMinutes)}
            onChange={(e) => save({ reminderLeadMinutes: Number(e.target.value) })}
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
              <h2 className="text-lg font-bold text-gray-800">🌙 Quiet Hours</h2>
              <p className="mt-1 text-sm text-gray-500">Reminders due during these hours wait until quiet hours end.</p>
            </div>
            <Toggle
              on={settings.quietHoursEnabled}
              onClick={() => save({ quietHoursEnabled: !settings.quietHoursEnabled })}
              color="bg-purple-500"
              label="Toggle quiet hours"
            />
          </div>

          {settings.quietHoursEnabled ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Start</label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => e.target.value && save({ quietHoursStart: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">End</label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => e.target.value && save({ quietHoursEnd: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400"
                />
              </div>
            </div>
          ) : null}
        </section>

        <button
          onClick={resetSettings}
          className="w-full rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200"
        >
          Reset Notification Settings
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          Your preferences are saved to your HerBloom account and apply on every device you sign in on.
        </p>
      </div>
    </div>
  );
}

export default NotificationSettings;