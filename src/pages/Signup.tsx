import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

// Must match the backend rules exactly
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number (0–9)", test: (p: string) => /\d/.test(p) },
];

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Signup() {
  const navigate = useNavigate();
  const { signUp, loading, isError, errMessage } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [healthDataConsent, setHealthDataConsent] = useState(false);

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

  const passedRules = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const allRulesPass = passedRules === PASSWORD_RULES.length;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSubmitted(false);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setFormError("Please enter a valid email address, e.g. name@example.com.");
      return;
    }
    if (!allRulesPass) {
      setFormError("Your password doesn't meet all the requirements yet — check the list under the password box.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      setFormError("Please agree to the terms of service and privacy policy.");
      return;
    }
    if (!healthDataConsent) {
      setFormError("Please give consent for HerBloom to collect and use your health data.");
      return;
    }

    setSubmitted(true);
    const success = await signUp(
      firstName.trim(),
      lastName.trim(),
      email.trim(),
      password,
      termsAccepted,
      healthDataConsent
    );

    if (success) navigate("/period-tracker");
  };

  const strengthColor = passedRules <= 1 ? "bg-red-400" : passedRules <= 3 ? "bg-yellow-400" : "bg-green-500";

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-pink-600">HerBloom</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">Her health. Her journey. Her bloom.</p>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Your Account</h2>
          <p className="mt-3 text-gray-600">Join HerBloom and take the first step toward better health management.</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md">
          <form onSubmit={handleSignup} className="space-y-6">

            {/* Names */}
            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label="First Name"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
              <FormInput
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>

            {/* Email */}
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {/* Password */}
            <div>
              <div className="relative">
                <FormInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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

              {/* Requirements — always visible so people know before they type */}
              <div className="mt-3 rounded-xl bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Your password needs</p>
                  {password ? (
                    <span className={`text-xs font-semibold ${allRulesPass ? "text-green-600" : "text-gray-500"}`}>
                      {passedRules}/{PASSWORD_RULES.length}
                    </span>
                  ) : null}
                </div>

                {password ? (
                  <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${strengthColor}`}
                      style={{ width: `${(passedRules / PASSWORD_RULES.length) * 100}%` }}
                    />
                  </div>
                ) : null}

                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {PASSWORD_RULES.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li key={rule.label} className={`flex items-center gap-2 text-sm ${ok ? "text-green-600" : "text-gray-500"}`}>
                        <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${ok ? "bg-green-500 text-white" : "border border-gray-300"}`}>
                          {ok ? "✓" : ""}
                        </span>
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-xs text-gray-400">Symbols like ! @ # are allowed but not required.</p>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <FormInput
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              {confirmPassword ? (
                <p className={`mt-2 text-sm ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
                  {passwordsMatch ? "✓ Passwords match" : "✗ Passwords don't match yet"}
                </p>
              ) : null}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 accent-pink-600"
              />
              <label htmlFor="terms" className="text-sm leading-5 text-gray-600">
                I agree to HerBloom's terms of service and privacy policy.
              </label>
            </div>

            {/* Health data consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="healthDataConsent"
                checked={healthDataConsent}
                onChange={(event) => setHealthDataConsent(event.target.checked)}
                className="mt-1 h-4 w-4 accent-pink-600"
              />
              <label htmlFor="healthDataConsent" className="text-sm leading-5 text-gray-600">
                I consent to HerBloom collecting and using my health data to provide personalized health tracking and support.
              </label>
            </div>

            {/* Errors */}
            {formError || (submitted && isError) ? (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{formError || errMessage}</div>
            ) : null}

            {loading && slowServer ? (
              <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                ⏳ Waking up the server — this can take up to a minute the first time. Please don't close the page.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-pink-600 hover:text-pink-700"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;