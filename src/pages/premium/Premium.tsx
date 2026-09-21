import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubscription, FREE_FEATURES, PREMIUM_FEATURES, type SubscriptionInfo } from "../../api/premiumApi";

const Premium = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SubscriptionInfo | null>(null);

  useEffect(() => {
    getMySubscription().then(setStatus).catch(() => setStatus(null));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Already premium */}
        {status?.isPremium ? (
          <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-green-200 bg-green-50 p-6 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-3xl">👑</span>
              <div>
                <p className="font-bold text-green-800">You're on HerBloom Premium</p>
                <p className="text-sm text-green-700">{status.daysLeft} days left on your {status.plan} plan.</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/premium/status")}
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              View My Plan
            </button>
          </div>
        ) : null}

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">💎</div>
          <h1 className="text-4xl font-bold text-gray-800">Upgrade to HerBloom Premium</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Get more personalized tools, insights and features to support your health journey.
          </p>
        </div>

        {/* Free vs Premium */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">FREE</span>
              <h2 className="mt-5 text-2xl font-bold text-gray-800">HerBloom Free</h2>
              <p className="mt-2 text-gray-500">Essential tools for your everyday health journey.</p>
            </div>
            <div className="space-y-4">
              {FREE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 text-green-500">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border-2 border-pink-300 bg-white p-8 shadow-lg">
            <div className="absolute right-5 top-5 rounded-full bg-pink-500 px-4 py-2 text-xs font-bold text-white">PREMIUM</div>
            <div className="mb-6 pr-24">
              <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">💎 HERBLOOM PREMIUM</span>
              <h2 className="mt-5 text-2xl font-bold text-gray-800">More personalized care</h2>
              <p className="mt-2 text-gray-500">Everything in Free, plus deeper insight into your health journey.</p>
            </div>
            <div className="space-y-4">
              {PREMIUM_FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 text-pink-500">◆</span>
                  <span>
                    {f.title}
                    {!f.available ? <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Coming soon</span> : null}
                  </span>
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
              <p className="mt-2 text-sm text-white/80">Understand your health patterns with additional insights.</p>
            </div>
            <div>
              <div className="mb-3 text-3xl">🌸</div>
              <h3 className="font-bold">Personalized Experience</h3>
              <p className="mt-2 text-sm text-white/80">Get more tools tailored to your health journey.</p>
            </div>
            <div>
              <div className="mb-3 text-3xl">🔔</div>
              <h3 className="font-bold">More Support</h3>
              <p className="mt-2 text-sm text-white/80">Access additional reminders, education and wellness tools.</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          HerBloom Premium features are designed to support health management and education. They do not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default Premium;