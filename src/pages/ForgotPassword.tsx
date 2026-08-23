function ForgotPassword() {
  return (
    <div className="auth-page">
      <h1>Forgot Password</h1>

      <p>
        Enter your email address and we will send you instructions
        to reset your password.
      </p>

      <form>
        <label htmlFor="email">Email Address</label>

        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          required
        />

        <button type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;