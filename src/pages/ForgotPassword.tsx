import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!email) {
      return;
    }

    setSubmitted(true);
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

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
              >
                Send Reset Link
              </button>

            </form>
          ) : (
            /* Success Message */
            <div className="text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl">✓</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Check Your Email
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                If an account exists for{" "}
                <span className="font-semibold text-gray-900">
                  {email}
                </span>
                , you will receive instructions to
                reset your password.
              </p>

            </div>
          )}

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
