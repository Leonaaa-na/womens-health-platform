import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

// Same rules as signup
const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "A number", test: (p: string) => /\d/.test(p) },
];

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";

const AccountSecurity = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [account, setAccount] = useState<{ email: string; createdAt: string; lastLoginAt: string | null } | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient
      .get("/users/me")
      .then((res) => setAccount(res.data.data))
      .catch(() => setAccount(null));
  }, []);

  const allRulesPass = RULES.every((r) => r.test(newPassword));

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (!allRulesPass) {
      setError("Your new password doesn't meet all the requirements yet.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Your new password must be different from your current one.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.put("/users/change-password", { currentPassword, newPassword });
      setMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Could not change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputType = showPasswords ? "text" : "password";
  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100";

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
              🔐
            </div>
            <h1 className="mt-5 text-3xl font-bold text-gray-800">Account & Security</h1>
            <p className="mt-2 text-gray-600">Manage your password and keep your HerBloom account secure.</p>
          </div>
        </div>

        {/* Account activity */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="font-bold text-gray-800">👤 Account</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Signed in as</p>
              <p className="mt-1 break-all text-sm font-medium text-gray-800">{account?.email || "—"}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Last sign-in</p>
              <p className="mt-1 text-sm font-medium text-gray-800">{formatDateTime(account?.lastLoginAt)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Account created</p>
              <p className="mt-1 text-sm font-medium text-gray-800">{formatDateTime(account?.createdAt)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">Don't recognise the last sign-in? Change your password below.</p>
        </div>

        {/* Change Password */}
        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">🔑 Change Password</h2>
            <p className="mt-2 text-sm text-gray-500">Update the password used to access your HerBloom account.</p>
          </div>

          {message ? (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              ✅ {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              ⚠️ {error}
            </div>
          ) : null}

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="mb-2 block text-sm font-semibold text-gray-700">Current Password</label>
              <input
                id="currentPassword"
                type={inputType}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-gray-700">New Password</label>
              <input
                id="newPassword"
                type={inputType}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                autoComplete="new-password"
                className={inputClass}
              />
              <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                {RULES.map((rule) => {
                  const ok = rule.test(newPassword);
                  return (
                    <li key={rule.label} className={`text-xs ${ok ? "text-green-600" : "text-gray-400"}`}>
                      {ok ? "✓" : "○"} {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-gray-700">Confirm New Password</label>
              <input
                id="confirmPassword"
                type={inputType}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                className={inputClass}
              />
              {confirmPassword && confirmPassword !== newPassword ? (
                <p className="mt-2 text-xs text-red-500">Passwords don't match yet.</p>
              ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="h-4 w-4 accent-pink-500"
              />
              Show passwords
            </label>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "🔒 Change Password"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Reminder */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
          <h3 className="font-bold text-gray-800">🔒 Security Reminder</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600">
            <li>• Keep your password private.</li>
            <li>• Avoid using the same password on multiple accounts.</li>
            <li>• Always log out when using a shared device.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;