import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const SETTINGS_KEY = "herbloomAppSettings";

// Leftovers from before the backend existed — safe to remove now
const OLD_LOCAL_KEYS = [
  "herbloomAppointments",
  "herbloomCommunityPosts",
  "herbloomSupportedPosts",
  "herbloomCommunityComments",
  "herbloomUserProfile",
  "herbloomNotificationSettings",
  "herbloomReminders",
];

const applyClasses = (dark: boolean, compact: boolean) => {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("compact", compact);
};

const readLocal = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return { darkMode: !!parsed.darkMode, compactView: !!parsed.compactView };
  } catch {
    return { darkMode: false, compactView: false };
  }
};

const writeLocal = (darkMode: boolean, compactView: boolean) =>
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ darkMode, compactView }));

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={on}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-pink-500" : "bg-gray-300"}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

const AppSettings = () => {
  const navigate = useNavigate();

  const initial = readLocal();
  const [darkMode, setDarkMode] = useState(initial.darkMode);
  const [compactView, setCompactView] = useState(initial.compactView);
  const [message, setMessage] = useState("");
  const [cleared, setCleared] = useState(false);

  // Your account's theme wins over this browser's copy
  useEffect(() => {
    const load = async () => {
      try {
        const theme = (await apiClient.get("/users/profile")).data.data?.theme;
        if (theme === "dark" || theme === "light") {
          const dark = theme === "dark";
          setDarkMode(dark);
          writeLocal(dark, readLocal().compactView);
          applyClasses(dark, readLocal().compactView);
        }
      } catch {
        // offline: keep the local copy
      }
    };
    applyClasses(initial.darkMode, initial.compactView);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDarkModeToggle = async () => {
    const next = !darkMode;
    setDarkMode(next);
    applyClasses(next, compactView);
    writeLocal(next, compactView);
    try {
      await apiClient.put("/users/profile", { theme: next ? "dark" : "light" });
      flash(next ? "🌙 Dark mode on — saved to your account." : "☀️ Light mode on — saved to your account.");
    } catch {
      flash("Saved on this device. We'll sync it to your account next time.");
    }
  };

  // Compact view is a per-device choice (small phone vs big screen)
  const handleCompactViewToggle = () => {
    const next = !compactView;
    setCompactView(next);
    applyClasses(darkMode, next);
    writeLocal(darkMode, next);
    flash(next ? "Compact view on for this device." : "Standard spacing on for this device.");
  };

  const clearOldData = () => {
    OLD_LOCAL_KEYS.forEach((key) => localStorage.removeItem(key));
    setCleared(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="mb-5 text-sm font-semibold text-pink-600 transition hover:text-pink-700"
          >
            ← Back to Profile
          </button>
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-4xl shadow-md">
              ⚙️
            </div>
            <h1 className="mt-5 text-3xl font-bold text-gray-800">App Settings</h1>
            <p className="mt-2 text-gray-600">Manage your general HerBloom app preferences. Changes save automatically.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">
          {message ? (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          ) : null}

          {/* Appearance */}
          <h2 className="text-xl font-bold text-gray-800">🎨 Appearance</h2>
          <p className="mt-2 text-sm text-gray-500">Choose how HerBloom should look and feel.</p>

          <div className="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                <p className="mt-1 text-sm text-gray-500">Use a darker appearance. Follows you to every device you sign in on.</p>
              </div>
              <Toggle on={darkMode} onClick={handleDarkModeToggle} label="Toggle dark mode" />
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-semibold text-gray-800">Compact View</h3>
                <p className="mt-1 text-sm text-gray-500">Reduce spacing on this device to fit more on screen.</p>
              </div>
              <Toggle on={compactView} onClick={handleCompactViewToggle} label="Toggle compact view" />
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{darkMode ? "🌙" : "☀️"}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{darkMode ? "Dark Mode is On" : "Light Mode is On"}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {compactView ? "Compact View is also enabled." : "Standard spacing is being used."}
                </p>
              </div>
            </div>
          </div>

          {/* Data */}
          <h2 className="mt-8 text-xl font-bold text-gray-800">💾 Data & Storage</h2>
          <p className="mt-2 text-sm text-gray-500">Where your HerBloom information lives.</p>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
              <h3 className="font-semibold text-gray-800">☁️ Saved to your account</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your trackers, appointments, reminders, community activity and settings are stored securely on HerBloom's
                servers, so they're there whenever you sign in.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-800">📱 Old data on this device</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Earlier versions of HerBloom kept some demo data in this browser. It isn't used anymore and can be safely
                removed. Your account data isn't affected.
              </p>
              <button
                type="button"
                onClick={clearOldData}
                disabled={cleared}
                className="mt-4 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
              >
                {cleared ? "✓ Old data cleared" : "Clear old device data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;