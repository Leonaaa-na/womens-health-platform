import { useNavigate } from "react-router-dom";
import { getPremiumStatus } from "../../services/premiumService";

const PremiumStatus = () => {
  const navigate = useNavigate();
  const premiumStatus = getPremiumStatus();

  const isPremium = premiumStatus.isPremium;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">
            {isPremium ? "👑" : "🌸"}
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            My HerBloom Plan
          </h1>

          <p className="mt-2 text-gray-600">
            View your current HerBloom subscription status.
          </p>
        </div>

        {/* Status Card */}
        <div className="rounded-3xl border border-pink-200 bg-white p-8 shadow-lg">

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Current Plan
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {isPremium
                  ? "HerBloom Premium"
                  : "HerBloom Free"}
              </h2>

              <p className="mt-2 text-gray-600">
                {isPremium
                  ? "You have access to Premium features."
                  : "You are currently using the free HerBloom plan."}
              </p>
            </div>

            <div
              className={`rounded-2xl px-6 py-4 text-center ${
                isPremium
                  ? "bg-gradient-to-r from-pink-100 to-purple-100"
                  : "bg-gray-100"
              }`}
            >
              <div className="text-3xl">
                {isPremium ? "👑" : "🌸"}
              </div>

              <p
                className={`mt-1 text-sm font-bold ${
                  isPremium
                    ? "text-pink-700"
                    : "text-gray-600"
                }`}
              >
                {isPremium ? "PREMIUM" : "FREE"}
              </p>
            </div>

          </div>

          {/* Plan details */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Subscription Type
              </p>

              <p className="mt-1 font-bold capitalize text-gray-800">
                {premiumStatus.plan}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Subscription Status
              </p>

              <p className="mt-1 font-bold text-gray-800">
                {isPremium ? "Active" : "Free"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Expiration
              </p>

              <p className="mt-1 font-bold text-gray-800">
                {premiumStatus.expiresAt
                  ? new Date(
                      premiumStatus.expiresAt
                    ).toLocaleDateString()
                  : isPremium
                    ? "Managed by subscription"
                    : "Not applicable"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Premium Access
              </p>

              <p className="mt-1 font-bold text-gray-800">
                {isPremium
                  ? "Unlocked"
                  : "Locked"}
              </p>
            </div>

          </div>

          {/* Premium user */}
          {isPremium ? (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
              <div className="flex gap-3">
                <span className="text-2xl">✅</span>

                <div>
                  <h3 className="font-bold text-green-800">
                    Premium is active
                  </h3>

                  <p className="mt-1 text-sm text-green-700">
                    Your Premium features are currently available.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/premium/features")}
                className="mt-5 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700"
              >
                Explore Premium Features →
              </button>
            </div>
          ) : (
            /* Free user */
            <div className="mt-8 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 p-6">
              <h3 className="text-lg font-bold text-gray-800">
                Unlock HerBloom Premium 👑
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Explore the additional features available with
                HerBloom Premium.
              </p>

              <button
                onClick={() => navigate("/premium/plans")}
                className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
              >
                View Premium Plans →
              </button>
            </div>
          )}

        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/premium")}
            className="text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            ← Back to Premium
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Subscription information will eventually be synchronized
          with your HerBloom account and backend.
        </p>

      </div>
    </div>
  );
};

export default PremiumStatus;