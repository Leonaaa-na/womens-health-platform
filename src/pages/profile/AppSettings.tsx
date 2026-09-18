import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AppSettingsData {
  darkMode: boolean;
  compactView: boolean;
}

const SETTINGS_KEY = "herbloomAppSettings";

const defaultSettings: AppSettingsData = {
  darkMode: false,
  compactView: false,
};

const AppSettings = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);

      if (!savedSettings) {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.remove("compact");
        return;
      }

      const parsed = JSON.parse(
        savedSettings
      ) as Partial<AppSettingsData>;

      const settings: AppSettingsData = {
        ...defaultSettings,
        ...parsed,
      };

      setDarkMode(settings.darkMode);
      setCompactView(settings.compactView);

      if (settings.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      if (settings.compactView) {
        document.documentElement.classList.add("compact");
      } else {
        document.documentElement.classList.remove("compact");
      }
    } catch {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("compact");
    }
  }, []);

  const saveSettings = (
    newDarkMode: boolean,
    newCompactView: boolean
  ) => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        darkMode: newDarkMode,
        compactView: newCompactView,
      })
    );
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;

    setDarkMode(newValue);

    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    saveSettings(newValue, compactView);
  };

  const handleCompactViewToggle = () => {
    const newValue = !compactView;

    setCompactView(newValue);

    if (newValue) {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }

    saveSettings(darkMode, newValue);
  };

  const handleSave = () => {
    saveSettings(darkMode, compactView);

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (compactView) {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
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

            <h1 className="mt-5 text-3xl font-bold text-gray-800">
              App Settings
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your general HerBloom app preferences.
            </p>
          </div>
        </div>

        {/* Settings Card */}
        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">

          {/* Saved Message */}
          {saved && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              ✅ Your app settings have been saved.
            </div>
          )}

          {/* Appearance */}
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              🎨 Appearance
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Choose how HerBloom should look and feel.
            </p>
          </div>

          <div className="mt-5 divide-y divide-gray-100 rounded-2xl border border-gray-100">

            {/* Dark Mode */}
            <div className="flex items-center justify-between gap-4 p-5">

              <div>
                <h3 className="font-semibold text-gray-800">
                  Dark Mode
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Use a darker appearance throughout the app.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDarkModeToggle}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  darkMode
                    ? "bg-pink-500"
                    : "bg-gray-300"
                }`}
                aria-label="Toggle dark mode"
                aria-pressed={darkMode}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    darkMode
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

            {/* Compact View */}
            <div className="flex items-center justify-between gap-4 p-5">

              <div>
                <h3 className="font-semibold text-gray-800">
                  Compact View
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Reduce spacing and make more content visible on screen.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCompactViewToggle}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  compactView
                    ? "bg-pink-500"
                    : "bg-gray-300"
                }`}
                aria-label="Toggle compact view"
                aria-pressed={compactView}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    compactView
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

          </div>

          {/* Current Appearance */}
          <div className="mt-6 rounded-2xl bg-gray-50 p-5">

            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {darkMode ? "🌙" : "☀️"}
              </span>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {darkMode
                    ? "Dark Mode is On"
                    : "Light Mode is On"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {compactView
                    ? "Compact View is also enabled."
                    : "Standard spacing is being used."}
                </p>
              </div>

            </div>

          </div>

          {/* Data & Storage */}
          <div className="mt-8">

            <h2 className="text-xl font-bold text-gray-800">
              💾 Data & Storage
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage information stored locally by the HerBloom app.
            </p>

          </div>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">

            <h3 className="font-semibold text-gray-800">
              Local App Data
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Some preferences and temporary app information may be
              stored on your device while HerBloom is being developed.
            </p>

            <p className="mt-3 text-xs text-gray-400">
              Full account data management will be connected to your
              HerBloom account later.
            </p>

          </div>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
          >
            Save Settings
          </button>

        </div>

      </div>
    </div>
  );
};

export default AppSettings;