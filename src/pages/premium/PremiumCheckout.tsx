import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPlans,
  getMySubscription,
  startSubscriptionPayment,
  formatGhs,
  formatDate,
  apiErrorMessage,
  type Plan,
  type SubscriptionInfo,
} from "../../api/premiumApi";

const PremiumCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPlanId = searchParams.get("plan");

  const [plan, setPlan] = useState<Plan | null>(null);
  const [status, setStatus] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [planData, sub] = await Promise.all([getPlans(), getMySubscription().catch(() => null)]);
        setPlan(planData.plans.find((p) => p.id === selectedPlanId) || null);
        setStatus(sub);
      } catch {
        setError("Could not load plan details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedPlanId]);

  const handleContinueToPayment = async () => {
    if (!plan) return;
    setError("");
    setPaying(true);
    try {
      const { authorizationUrl } = await startSubscriptionPayment(plan.id);
      if (!authorizationUrl) throw new Error("No Paystack payment link was returned.");
      window.location.href = authorizationUrl; // off to Paystack
    } catch (err) {
      setError(apiErrorMessage(err, err instanceof Error ? err.message : "Something went wrong while starting payment."));
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-5xl">💎</div>
          <h1 className="text-2xl font-bold text-gray-800">No Premium Plan Selected</h1>
          <p className="mt-3 text-gray-600">{error || "Please return to the Premium Plans page and choose a plan."}</p>
          <button
            onClick={() => navigate("/premium/plans")}
            className="mt-6 rounded-xl bg-pink-500 px-6 py-3 font-semibold text-white hover:bg-pink-600"
          >
            View Premium Plans
          </button>
        </div>
      </div>
    );
  }

  // Where the new time will run to (extends an active plan)
  const startFrom =
    status?.isPremium && status.subscription ? new Date(status.subscription.endDate) : new Date();
  const newEnd = new Date(startFrom.getTime() + plan.durationDays * 86400000).toISOString();
  const period = plan.id === "yearly" ? "per year" : "per month";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">💎</div>
          <h1 className="text-3xl font-bold text-gray-800">HerBloom Premium Checkout</h1>
          <p className="mt-2 text-gray-600">Review your plan before continuing.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Summary */}
          <div className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">Subscription Summary</h2>
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-pink-500 p-3 text-xl">💎</div>
                <div>
                  <h3 className="font-bold text-gray-800">{plan.name} Premium</h3>
                  <p className="text-sm text-gray-500">HerBloom Premium</p>
                </div>
              </div>
              <div className="mt-6">
                <span className="text-3xl font-bold text-pink-600">{formatGhs(plan.price)}</span>
                <span className="ml-2 text-sm text-gray-500">{period}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-800">{plan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Access</span>
                <span className="font-semibold text-gray-800">{plan.durationDays} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{status?.isPremium ? "New end date" : "Premium until"}</span>
                <span className="font-semibold text-gray-800">{formatDate(newEnd)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Renewal</span>
                <span className="font-semibold text-gray-800">Doesn't auto-renew</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-pink-600">{formatGhs(plan.price)}</span>
                </div>
              </div>
            </div>

            {status?.isPremium ? (
              <p className="mt-4 rounded-xl bg-green-50 p-3 text-xs text-green-700">
                You're already Premium — this adds {plan.durationDays} days on top of your current plan.
              </p>
            ) : null}
          </div>

          {/* Payment */}
          <div className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">Payment</h2>
            <p className="mt-2 text-sm text-gray-500">You'll be taken to Paystack to pay by card or Mobile Money.</p>

            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex gap-3">
                <span className="text-xl">🔐</span>
                <div>
                  <h3 className="font-bold text-green-800">Secure Payment</h3>
                  <p className="mt-1 text-sm text-green-700">HerBloom never sees or stores your card or wallet details.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-800">What happens next?</h3>
              <ol className="mt-3 space-y-3 text-sm text-gray-600">
                <li>1. Continue to Paystack.</li>
                <li>2. Pay by card, or approve the Mobile Money prompt on your phone.</li>
                <li>3. You're brought back here and HerBloom confirms the payment.</li>
                <li>4. Premium switches on straight away.</li>
              </ol>
            </div>

            {error ? <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

            <button
              onClick={handleContinueToPayment}
              disabled={paying}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying ? "Connecting to Paystack..." : `Pay ${formatGhs(plan.price)} →`}
            </button>

            <button
              onClick={() => navigate("/premium/plans")}
              disabled={paying}
              className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              ← Change Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCheckout;