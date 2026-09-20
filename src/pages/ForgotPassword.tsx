import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.post("/users/forgot-password", {
        email: email.trim(),
      });

      navigate(
        `/reset-password?email=${encodeURIComponent(
          email.trim()
        )}`
      );
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(
        apiError.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-md">

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <span className="text-3xl">🔐</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-gray-600">
            No worries. Enter your email address and
            we'll help you get back into your account.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-md">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-wait disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-wait disabled:opacity-70"
            >
              {loading
                ? "Sending Reset Link..."
                : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full text-center text-sm font-semibold text-pink-600 transition hover:text-pink-700"
          >
            ← Back to Login
          </button>
        </div>

        {/* Security Note */}
        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          Your privacy and security are important to us.
          We never share your personal information without
          your permission.
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;