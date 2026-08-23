function ResetPassword() {
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
          Create a new password for your account.
        </p>

        {/* Form */}
        <form className="space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter your new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition duration-200"
          >
            Reset Password
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
  )
}

export default ResetPassword