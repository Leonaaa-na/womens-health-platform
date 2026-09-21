import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPlans,
  getMySubscription,
  formatGhs,
  FREE_FEATURES,
  PREMIUM_FEATURES,
  type Plan,
  type SubscriptionInfo,
} from "../../api/premiumApi";

const PremiumPlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [status, setStatus] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [planData, sub] = await Promise.all([getPlans(), getMySubscription().catch(() => null)]);
        setPlans(planData.plans);
        setStatus(sub);
      } catch {
        setError("Could not load plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isPremium = !!status?.isPremium;
  const includedFeatures = PREMIUM_FEATURES.filter((f) => f.available).map((f) => f.title);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">💎</div>
          <h1 className="text-4xl font-bold text-gray-800">{isPremium ? "Extend Your Premium" : "Choose Your HerBloom Plan"}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            {isPremium
              ? `You have ${status?.daysLeft} days left. Buying again adds the time on top — nothing is lost.`
              : "Choose the plan that fits your health journey. Plans don't renew automatically."}
          </p>
        </div>

        {error ? <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">{error}</div> : null}

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">

            {/* Free */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">FREE</span>
                <h2 className="mt-5 text-2xl font-bold text-gray-800">Free</h2>
                <div className="mt-3"><span className="text-4xl font-bold text-gray-800">GH₵0</span></div>
                <p className="mt-2 text-sm text-gray-500">Essential HerBloom features.</p>
              </div>
              <div className="space-y-4">
                {FREE_FEATURES.map((feature) => (
                  <div key={feature} className="flex gap-3 text-sm text-gray-700">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/period-tracker")}
                className="mt-8 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                {isPremium ? "Back to HerBloom" : "Continue with Free"}
              </button>
            </div>

            {/* Paid plans from the backend */}
            {plans.map((plan) => {
              const yearly = plan.id === "yearly";
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl bg-white p-8 ${
                    yearly ? "border border-purple-300 shadow-lg" : "border-2 border-pink-400 shadow-xl"
                  }`}
                >
                  <div className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-bold text-white ${yearly ? "bg-purple-500" : "bg-pink-500"}`}>
                    {plan.badge ? plan.badge.toUpperCase() : "POPULAR"}
                  </div>

                  <div className="mb-6">
                    <span className={`rounded-full px-4 py-2 text-xs font-bold ${yearly ? "bg-purple-100 text-purple-700" : "bg-pink-100 text-pink-700"}`}>
                      {yearly ? "👑 PREMIUM" : "💎 PREMIUM"}
                    </span>
                    <h2 className="mt-5 text-2xl font-bold text-gray-800">{plan.name}</h2>
                    <div className="mt-3">
                      <span className={`text-4xl font-bold ${yearly ? "text-purple-600" : "text-pink-600"}`}>{formatGhs(plan.price)}</span>
                      <span className="text-gray-500"> / {yearly ? "year" : "month"}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{plan.savingsNote || plan.description}</p>
                  </div>

                  <div className="space-y-4">
                    {["Everything in Free", ...includedFeatures].map((feature) => (
                      <div key={feature} className="flex gap-3 text-sm text-gray-700">
                        <span className={yearly ? "text-purple-500" : "text-pink-500"}>◆</span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/premium/checkout?plan=${plan.id}`)}
                    className={`mt-8 w-full rounded-xl px-5 py-3 font-bold text-white shadow-md transition ${
                      yearly ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    }`}
                  >
                    {isPremium ? `Add ${yearly ? "a year" : "a month"}` : `Choose ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Why Premium */}
        <div className="mt-10 rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Why Premium?</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-pink-50 p-5">
              <div className="text-3xl">📊</div>
              <h3 className="mt-3 font-bold text-gray-800">More Insights</h3>
              <p className="mt-2 text-sm text-gray-600">Explore additional health patterns and information.</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-5">
              <div className="text-3xl">🌸</div>
              <h3 className="mt-3 font-bold text-gray-800">Personalized Tools</h3>
              <p className="mt-2 text-sm text-gray-600">Access additional tools designed around your journey.</p>
            </div>
            <div className="rounded-2xl bg-fuchsia-50 p-5">
              <div className="text-3xl">🔔</div>
              <h3 className="mt-3 font-bold text-gray-800">Enhanced Support</h3>
              <p className="mt-2 text-sm text-gray-600">Unlimited reminders with repeats, and unlimited saved articles.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate("/premium")} className="text-sm font-semibold text-pink-600 hover:text-pink-700">
            ← Back to Premium
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Payments are handled securely by Paystack (card or Mobile Money). Plans don't renew automatically.
        </p>
      </div>
    </div>
  );
};

export default PremiumPlans;