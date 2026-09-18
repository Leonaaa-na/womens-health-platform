import { useNavigate } from "react-router-dom";

const PremiumPlans = () => {
  const navigate = useNavigate();

  const handleChoosePlan = (plan: string) => {
    navigate(`/premium/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">💎</div>

          <h1 className="text-4xl font-bold text-gray-800">
            Choose Your HerBloom Plan
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Choose the plan that fits your health journey. You can change
            your plan later.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Free */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">
                FREE
              </span>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                Free
              </h2>

              <div className="mt-3">
                <span className="text-4xl font-bold text-gray-800">
                  GH₵0
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Essential HerBloom features.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Period Tracker",
                "Pregnancy Tracker",
                "Health Library",
                "Healthcare Professionals",
                "Emergency Assistance",
                "Community",
                "Basic Reminders",
                "Appointments",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex gap-3 text-sm text-gray-700"
                >
                  <span className="text-green-500">✓</span>
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/period-tracker")}
              className="mt-8 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Continue with Free
            </button>
          </div>

          {/* Monthly */}
          <div className="relative rounded-3xl border-2 border-pink-400 bg-white p-8 shadow-xl">
            <div className="absolute right-5 top-5 rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">
              POPULAR
            </div>

            <div className="mb-6">
              <span className="rounded-full bg-pink-100 px-4 py-2 text-xs font-bold text-pink-700">
                💎 PREMIUM
              </span>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                Monthly
              </h2>

              <div className="mt-3">
                <span className="text-4xl font-bold text-pink-600">
                  GH₵20
                </span>
                <span className="text-gray-500"> / month</span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Flexible monthly access.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Everything in Free",
                "Advanced cycle insights",
                "Personalized health insights",
                "Advanced pregnancy insights",
                "Advanced wellness tracking",
                "Enhanced health history",
                "Premium educational content",
                "Advanced reminders",
                "Premium community features",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex gap-3 text-sm text-gray-700"
                >
                  <span className="text-pink-500">◆</span>
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleChoosePlan("monthly")}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
            >
              Choose Monthly
            </button>
          </div>

          {/* Yearly */}
          <div className="relative rounded-3xl border border-purple-300 bg-white p-8 shadow-lg">
            <div className="absolute right-5 top-5 rounded-full bg-purple-500 px-3 py-1 text-xs font-bold text-white">
              YEARLY
            </div>

            <div className="mb-6">
              <span className="rounded-full bg-purple-100 px-4 py-2 text-xs font-bold text-purple-700">
                👑 PREMIUM
              </span>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                Yearly
              </h2>

              <div className="mt-3">
                <span className="text-4xl font-bold text-purple-600">
                  GH₵200
                </span>
                <span className="text-gray-500"> / year</span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Full-year Premium access.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Everything in Free",
                "All Premium features",
                "Advanced health insights",
                "Advanced pregnancy tools",
                "Enhanced health history",
                "Premium education",
                "Advanced reminders",
                "Premium community features",
                "Full-year access",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex gap-3 text-sm text-gray-700"
                >
                  <span className="text-purple-500">◆</span>
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleChoosePlan("yearly")}
              className="mt-8 w-full rounded-xl bg-purple-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-purple-700"
            >
              Choose Yearly
            </button>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-10 rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            Why Premium?
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-pink-50 p-5">
              <div className="text-3xl">📊</div>
              <h3 className="mt-3 font-bold text-gray-800">
                More Insights
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Explore additional health patterns and information.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="text-3xl">🌸</div>
              <h3 className="mt-3 font-bold text-gray-800">
                Personalized Tools
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Access additional tools designed around your journey.
              </p>
            </div>

            <div className="rounded-2xl bg-fuchsia-50 p-5">
              <div className="text-3xl">🔔</div>
              <h3 className="mt-3 font-bold text-gray-800">
                Enhanced Support
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Unlock additional reminders, education and community tools.
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/premium")}
            className="text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            ← Back to Premium
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Premium pricing is managed by the HerBloom payment system.
        </p>
      </div>
    </div>
  );
};

export default PremiumPlans;