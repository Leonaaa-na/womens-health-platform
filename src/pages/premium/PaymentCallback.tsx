import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { verifyPayment, apiErrorMessage } from "../../api/premiumApi";

const MAX_CHECKS = 5; // about 20 seconds in total
const CHECK_EVERY_MS = 4000;

type Status = "verifying" | "waiting" | "success" | "failed";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshPremium } = useAuth();

  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Please wait while we confirm your payment...");
  const checks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const check = useCallback(async () => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference was found.");
      return;
    }

    try {
      const payment = await verifyPayment(reference);
      checks.current += 1;

      if (payment.status === "success") {
        await Promise.resolve(refreshPremium?.()).catch(() => undefined); // update Premium everywhere
        setStatus("success");
        setMessage("Your payment has been confirmed and Premium is now active.");
        return;
      }

      if (payment.status === "pending") {
        // Usually Mobile Money waiting for approval on the phone
        if (checks.current < MAX_CHECKS) {
          setStatus("verifying");
          setMessage("Waiting for your payment to be approved... If you're paying with Mobile Money, approve the prompt on your phone.");
          timer.current = setTimeout(check, CHECK_EVERY_MS);
        } else {
          setStatus("waiting");
          setMessage("Your payment is still processing. Once you've approved it, tap 'Check again'.");
        }
        return;
      }

      setStatus("failed");
      setMessage(payment.status === "abandoned" ? "The payment was cancelled before it was completed." : "The payment was not successful. You have not been charged for Premium.");
    } catch (error) {
      setStatus("failed");
      setMessage(apiErrorMessage(error, "We could not confirm your payment."));
    }
  }, [reference, refreshPremium]);

  useEffect(() => {
    check();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [check]);

  const checkAgain = () => {
    checks.current = 0;
    setStatus("verifying");
    setMessage("Checking again...");
    check();
  };

  if (status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <span className="animate-pulse text-3xl">💳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Confirming Payment</h1>
          <p className="mt-3 text-gray-600">{message}</p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-pink-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-pink-500" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "waiting") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-4xl">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Processing</h1>
          <p className="mt-4 leading-6 text-gray-600">{message}</p>
          <button
            onClick={checkAgain}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 font-bold text-white shadow-md"
          >
            Check again
          </button>
          <button
            onClick={() => navigate("/premium/status")}
            className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View My Plan
          </button>
          <p className="mt-4 text-xs text-gray-400">If it goes through later, Premium switches on automatically.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">✓</div>
          <div className="mb-3 inline-flex rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 text-xs font-bold text-pink-700">
            👑 PREMIUM ACTIVE
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="mt-4 leading-6 text-gray-600">{message}</p>
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
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">!</div>
        <h1 className="text-2xl font-bold text-gray-800">Payment Not Completed</h1>
        <p className="mt-4 leading-6 text-gray-600">{message}</p>
        <button
          onClick={() => navigate("/premium/plans")}
          className="mt-7 w-full rounded-xl bg-pink-500 px-6 py-4 font-bold text-white transition hover:bg-pink-600"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate("/premium/status")}
          className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          View My Plan
        </button>
      </div>
    </div>
  );
};

export default PaymentCallback;