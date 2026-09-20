import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const AccountSecurity = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Your new password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "Could not change password.");
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not change password.";
      setError(message);
    } finally {
      setLoading(false);
    }
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
              🔐
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-800">
              Account & Security
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your password and keep your HerBloom account secure.
            </p>
          </div>
        </div>

        {/* Security Information */}
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex gap-4">
            <span className="text-2xl">🛡️</span>

            <div>
              <h2 className="font-bold text-blue-800">
                Keep your account secure
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                Use a strong password and avoid sharing your password
                with other people.
              </p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              🔑 Change Password
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Update the password used to access your HerBloom account.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              ✅ {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form
            onSubmit={handleChangePassword}
            className="space-y-6"
          >

            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Current Password
              </label>

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                placeholder="Enter your current password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                New Password
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Enter your new password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

              <p className="mt-2 text-xs text-gray-400">
                Password must contain at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your new password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Buttons */}
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

        {/* Security Reminder */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
          <h3 className="font-bold text-gray-800">
            🔒 Security Reminder
          </h3>

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