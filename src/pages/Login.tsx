import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const {
    login,
    loading,
    isError,
    errMessage,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    const success = await login(email, password);

    if (success) {
      navigate("/period-tracker");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="mx-auto max-w-md">

        {/* HerBloom Branding */}
        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-pink-600">
            HerBloom
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-500">
            Her health. Her journey. Her bloom.
          </p>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-3 text-gray-600">
            Log in to continue managing your health journey.
          </p>

        </div>

        {/* Login Form */}
        <div className="rounded-2xl bg-white p-8 shadow-md">

          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            {/* Email */}
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            {/* Password */}
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            {/* Error Message */}
            {isError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errMessage}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-pink-600"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() =>
                  navigate("/forgot-password")
                }
                className="text-sm font-semibold text-pink-600 hover:text-pink-700"
              >
                Forgot password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">

            Don't have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-pink-600 hover:text-pink-700"
            >
              Sign Up
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;