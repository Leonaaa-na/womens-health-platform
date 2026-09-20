import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient, ApiErrorResponse } from "../../api/client";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !code || !newPassword) return;
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.post("/users/reset-password", {
        email,
        code,
        newPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: ApiErrorResponse } };
      setError(
        apiError?.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Password Reset</h2>
          <p className="mt-3 text-sm text-gray-600">
            Your password has been reset successfully.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔐</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-3">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Enter the 6-digit code sent to your email and
          create a new password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 disabled:cursor-wait disabled:opacity-60"
            />
          </div>

          {/* Reset Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6-Digit Reset Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter the code from your email"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 disabled:cursor-wait disabled:opacity-60"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter your new password"
              required
              minLength={6}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 disabled:cursor-wait disabled:opacity-60"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm your new password"
              required
              minLength={6}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 disabled:cursor-wait disabled:opacity-60"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-200 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* Bottom text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-pink-600 font-semibold hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
