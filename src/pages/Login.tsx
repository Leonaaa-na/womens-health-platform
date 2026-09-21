import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Login() {
  const navigate = useNavigate();
  const { login, loading, isError, errMessage } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false); // only show server errors from THIS attempt
  const [slowServer, setSlowServer] = useState(false);

  // Render's free server sleeps — warn if it's taking a while to wake up
  useEffect(() => {
    if (!loading) {
      setSlowServer(false);
      return;
    }
    const t = setTimeout(() => setSlowServer(true), 5000);
    return () => clearTimeout(t);
  }, [loading]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    setSubmitted(false);

    if (!email.trim() || !password) {
      setFormError("Please enter your email and password.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setFormError("Please enter a valid email address, e.g. name@example.com.");
      return;
    }

    setSubmitted(true);
    const success = await login(email.trim(), password);
    if (success) navigate("/period-tracker");
  };

  // Make the server's message point people to the fix
  const serverError = submitted && isError ? errMessage : "";
  const wrongDetails = /invalid email or password/i.test(serverError || "");

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-md">

        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-pink-600">HerBloom</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">Her health. Her journey. Her bloom.</p>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-3 text-gray-600">Log in to continue managing your health journey.</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <form onSubmit={handleLogin} className="space-y-6">

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div>
              <div className="relative">
                <FormInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((c) => !c)}
                  className="absolute right-3 top-[38px] rounded-md px-2 py-1 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                HerBloom passwords have at least 8 characters, with an uppercase letter, a lowercase letter and a number.
                Passwords are case-sensitive.
              </p>
            </div>

            {/* Errors */}
            {formError ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{formError}</div> : null}

            {!formError && serverError ? (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {wrongDetails ? (
                  <>
                    <p className="font-semibold">The email or password is incorrect.</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-red-500">
                      <li>Check your email is spelled correctly.</li>
                      <li>Check Caps Lock — capital letters matter.</li>
                      <li>
                        Can't remember it?{" "}
                        <button type="button" onClick={() => navigate("/forgot-password")} className="font-semibold underline">
                          Reset your password
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  serverError
                )}
              </div>
            ) : null}

            {loading && slowServer ? (
              <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                ⏳ Waking up the server — this can take up to a minute the first time. Please don't close the page.
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-semibold text-pink-600 hover:text-pink-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

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