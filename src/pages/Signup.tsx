import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();

  const {
    signUp,
    loading,
    isError,
    errMessage,
  } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [termsAccepted, setTermsAccepted] =
    useState(false);

  const [healthDataConsent, setHealthDataConsent] =
    useState(false);

  const [formError, setFormError] = useState("");

  const handleSignup = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setFormError(
        "Please agree to the terms of service and privacy policy."
      );
      return;
    }

    if (!healthDataConsent) {
      setFormError(
        "Please give consent for HerBloom to collect and use your health data."
      );
      return;
    }

    const success = await signUp(
      firstName.trim(),
      lastName.trim(),
      email.trim(),
      password,
      termsAccepted,
      healthDataConsent
    );

    if (success) {
      navigate("/period-tracker");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* HerBloom Branding */}
        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-pink-600">
            HerBloom
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-500">
            Her health. Her journey. Her bloom.
          </p>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>

          <p className="mt-3 text-gray-600">
            Join HerBloom and take the first step toward
            better health management.
          </p>

        </div>

        {/* Sign Up Form */}
        <div className="rounded-2xl bg-white p-8 shadow-md">

          <form
            onSubmit={handleSignup}
            className="space-y-6"
          >

            {/* Name Fields */}
            <div className="grid gap-6 sm:grid-cols-2">

              <FormInput
                label="First Name"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />

              <FormInput
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />

            </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            {/* Confirm Password */}
            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
            />

            {/* Terms Consent */}
            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(event) =>
                  setTermsAccepted(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-pink-600"
              />

              <label
                htmlFor="terms"
                className="text-sm leading-5 text-gray-600"
              >
                I agree to HerBloom's terms of service
                and privacy policy.
              </label>

            </div>

            {/* Health Data Consent */}
            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                id="healthDataConsent"
                checked={healthDataConsent}
                onChange={(event) =>
                  setHealthDataConsent(event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-pink-600"
              />

              <label
                htmlFor="healthDataConsent"
                className="text-sm leading-5 text-gray-600"
              >
                I consent to HerBloom collecting and using
                my health data to provide personalized
                health tracking and support.
              </label>

            </div>

            {/* Error Message */}
            {(formError || isError) && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {formError || errMessage}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login Link */}
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