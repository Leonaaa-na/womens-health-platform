import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPlans, initializePayment } from "../../services/premiumService";
import type { PremiumPlan } from "../../services/premiumService";

const PremiumCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedPlanId = searchParams.get("plan");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState<PremiumPlan[]>([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const result = await getPlans();
      setPlans(result.plans);
    } catch {
      setPlans([]);
    }
  };

  const plan =
    selectedPlanId === "yearly"
      ? plans.find((p) => p.id === "yearly")
      : selectedPlanId === "monthly"
        ? plans.find((p) => p.id === "monthly")
        : null;

  const fallbackPlans = {
    monthly: { name: "Monthly Premium", price: "GH₵20", amount: 20, period: "per month" },
    yearly: { name: "Yearly Premium", price: "GH₵200", amount: 200, period: "per year" },
  };

  const displayPlan = plan
    ? { name: plan.name, price: `GH₵${plan.price}`, amount: plan.price, period: plan.description }
    : selectedPlanId === "yearly"
      ? fallbackPlans.yearly
      : selectedPlanId === "monthly"
        ? fallbackPlans.monthly
        : null;

  if (!displayPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-5xl">💎</div>
          <h1 className="text-2xl font-bold text-gray-800">
            No Premium Plan Selected
          </h1>
          <p className="mt-3 text-gray-600">
            Please return to the Premium Plans page and choose a plan.
          </p>
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

  const handleContinueToPayment = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await initializePayment(selectedPlanId!);

      if (!result.authorizationUrl) {
        throw new Error(
          "Payment was initialized, but no Paystack payment link was returned."
        );
      }

      window.location.href = result.authorizationUrl;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while starting payment."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">💎</div>
          <h1 className="text-3xl font-bold text-gray-800">
            HerBloom Premium Checkout
          </h1>
          <p className="mt-2 text-gray-600">
            Review your subscription before continuing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Subscription Summary */}
          <div className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">
              Subscription Summary
            </h2>
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-pink-500 p-3 text-xl">💎</div>
                <div>
                  <h3 className="font-bold text-gray-800">{displayPlan.name}</h3>
                  <p className="text-sm text-gray-500">HerBloom Premium</p>
                </div>
              </div>
              <div className="mt-6">
                <span className="text-3xl font-bold text-pink-600">{displayPlan.price}</span>
                <span className="ml-2 text-sm text-gray-500">{displayPlan.period}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-800">{displayPlan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Billing</span>
                <span className="font-semibold text-gray-800">{displayPlan.period}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-pink-600">{displayPlan.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">
              Payment
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              You will be redirected to Paystack to complete the
              payment securely.
            </p>

            {/* Secure Payment */}
            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex gap-3">
                <span className="text-xl">🔐</span>
                <div>
                  <h3 className="font-bold text-green-800">
                    Secure Payment
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    HerBloom does not collect or store your card
                    details. Payment is handled by Paystack.
                  </p>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-800">
                What happens next?
              </h3>
              <ol className="mt-3 space-y-3 text-sm text-gray-600">
                <li>1. Confirm your selected plan.</li>
                <li>2. Continue to Paystack.</li>
                <li>3. Complete the payment there.</li>
                <li>4. HerBloom verifies the transaction.</li>
                <li>5. Your Premium subscription is activated.</li>
              </ol>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Continue */}
            <button
              onClick={handleContinueToPayment}
              disabled={isLoading}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Connecting to Paystack..." : "Continue to Payment →"}
            </button>

            <button
              onClick={() => navigate("/premium/plans")}
              disabled={isLoading}
              className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              ← Change Plan
            </button>
          </div>
        </div>

        {/* Payment Note */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-800">
          <strong>Payment information:</strong> HerBloom sends the
          selected plan to your existing backend, which initializes
          the Paystack transaction. Your backend then handles payment
          verification and subscription activation.
        </div>
      </div>
    </div>
  );
};

export default PremiumCheckout;
