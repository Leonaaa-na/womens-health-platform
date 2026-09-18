import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPremiumStatus, setPremiumStatus } from "../../services/premiumService";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");

  const [message, setMessage] = useState(
    "Please wait while we verify your payment..."
  );

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        setMessage("No payment reference was found.");
        return;
      }

      const token = localStorage.getItem("herbloomAccessToken");

      if (!token) {
        setStatus("failed");
        setMessage("Your session has expired. Please log in again.");
        return;
      }

      try {
        const backendUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000";

        const response = await fetch(
          `${backendUrl}/payment/verify/${encodeURIComponent(reference)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Payment verification failed."
          );
        }

        const payment = result.data;

        if (payment.status !== "success") {
          setStatus("failed");
          setMessage("The payment was not completed successfully.");
          return;
        }

        /*
          The backend has already created/updated the subscription.

          We update the frontend status so Premium features
          immediately become available.
        */

        const currentStatus = getPremiumStatus();

        const plan =
          payment.gatewayResponse?.metadata?.plan ||
          currentStatus.plan ||
          "monthly";

        setPremiumStatus({
          isPremium: true,
          plan: plan === "yearly" ? "yearly" : "monthly",
          expiresAt: null,
        });

        setStatus("success");
        setMessage(
          "Your payment has been verified and Premium access is now active."
        );
      } catch (error) {
        setStatus("failed");

        setMessage(
          error instanceof Error
            ? error.message
            : "We could not verify your payment."
        );
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <span className="animate-pulse text-3xl">💳</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Verifying Payment
          </h1>

          <p className="mt-3 text-gray-600">
            {message}
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-pink-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-pink-500" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✓
          </div>

          <div className="mb-3 inline-flex rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 text-xs font-bold text-pink-700">
            👑 PREMIUM ACTIVE
          </div>

          <h1 className="mt-3 text-3xl font-bold text-gray-800">
            Payment Successful!
          </h1>

          <p className="mt-4 leading-6 text-gray-600">
            {message}
          </p>

          <button
            onClick={() => navigate("/premium/features")}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
          >
            Explore Premium Features →
          </button>

          <button
            onClick={() => navigate("/premium/status")}
            className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
          !
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Payment Not Completed
        </h1>

        <p className="mt-4 leading-6 text-gray-600">
          {message}
        </p>

        <button
          onClick={() => navigate("/premium/plans")}
          className="mt-7 w-full rounded-xl bg-pink-500 px-6 py-4 font-bold text-white transition hover:bg-pink-600"
        >
          Return to Premium Plans
        </button>

        <button
          onClick={() => navigate("/premium")}
          className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Back to Premium
        </button>
      </div>
    </div>
  );
};

export default PaymentCallback;