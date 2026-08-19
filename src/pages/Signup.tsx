import FormInput from "../components/FormInput";

function Signup() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Create Your Account
          </h1>

          <p className="mt-3 text-gray-600">
            Join us and take the first step toward better health management.
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="rounded-2xl bg-white p-8 shadow-md">

          <form className="space-y-6">

            {/* Name Fields */}
            <div className="grid gap-6 sm:grid-cols-2">

              <FormInput
                label="First Name"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
              />

              <FormInput
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
              />

            </div>

            {/* Email */}
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
            />

            {/* Password */}
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password"
            />

            {/* Confirm Password */}
            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
            />

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 accent-pink-600"
              />

              <label
                htmlFor="terms"
                className="text-sm leading-5 text-gray-600"
              >
                I agree to the platform's terms of service and privacy policy.
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Create Account
            </button>

          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-pink-600 hover:text-pink-700"
            >
              Log In
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;