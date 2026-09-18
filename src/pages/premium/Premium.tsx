import { useNavigate } from "react-router-dom";

const Premium = () => {
  const navigate = useNavigate();

  const freeFeatures = [
    "Period tracking",
    "Pregnancy tracking",
    "Health Library",
    "Healthcare Professionals",
    "Emergency Assistance",
    "Community",
    "Basic reminders",
    "Appointment management",
  ];

  const premiumFeatures = [
    "Advanced cycle insights & reports",
    "Personalized health insights",
    "Advanced pregnancy insights",
    "Unlimited saved health articles",
    "Priority healthcare consultation access",
    "Advanced wellness tracking",
    "Advanced reminders & notifications",
    "Premium educational content",
    "Enhanced health history",
    "Premium community features",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">💎</div>

          <h1 className="text-4xl font-bold text-gray-800">
            Upgrade to HerBloom Premium
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Get more personalized tools, insights and features to support
            your health journey.
          </p>
        </div>

        {/* Free vs Premium */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Free */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                FREE
              </span>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                HerBloom Free
              </h2>

              <p className="mt-2 text-gray-500">
                Essential tools for your everyday health journey.
              </p>
            </div>

            <div className="space-y-4">
              {freeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span className="mt-0.5 text-green-500">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-pink-300 bg-white p-8 shadow-lg">

            <div className="absolute right-5 top-5 rounded-full bg-pink-500 px-4 py-2 text-xs font-bold text-white">
              PREMIUM
            </div>

            <div className="mb-6 pr-24">
              <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
                💎 HERBLOOM PREMIUM
              </span>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                More personalized care
              </h2>

              <p className="mt-2 text-gray-500">
                Unlock additional tools and features designed to give you
                deeper insight into your health journey.
              </p>
            </div>

            <div className="space-y-4">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span className="mt-0.5 text-pink-500">◆</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/premium/plans")}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
            >
              View Premium Plans →
            </button>
          </div>
        </div>

        {/* Why Premium */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white shadow-lg">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="mb-3 text-3xl">📊</div>
              <h3 className="font-bold">Deeper Insights</h3>
              <p className="mt-2 text-sm text-white/80">
                Understand your health patterns with additional insights.
              </p>
            </div>

            <div>
              <div className="mb-3 text-3xl">🌸</div>
              <h3 className="font-bold">Personalized Experience</h3>
              <p className="mt-2 text-sm text-white/80">
                Get more tools tailored to your health journey.
              </p>
            </div>

            <div>
              <div className="mb-3 text-3xl">🔔</div>
              <h3 className="font-bold">More Support</h3>
              <p className="mt-2 text-sm text-white/80">
                Access additional reminders, education and wellness tools.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          HerBloom Premium features are designed to support health management
          and education. They do not replace professional medical advice.
        </p>

      </div>
    </div>
  );
};

export default Premium;