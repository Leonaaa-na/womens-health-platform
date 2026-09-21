import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMySubscription,
  getMyPayments,
  formatGhs,
  formatDate,
  type SubscriptionInfo,
  type PaymentRecord,
} from "../../api/premiumApi";

const STATUS_STYLE: Record<PaymentRecord["status"], string> = {
  success: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  abandoned: "bg-gray-100 text-gray-600",
};

const PremiumStatusPage = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState<SubscriptionInfo>({ subscription: null, isPremium: false, daysLeft: 0, plan: "free" });
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sub, pays] = await Promise.all([getMySubscription(), getMyPayments().catch(() => [])]);
        setStatus(sub);
        setPayments(pays);
      } catch {
        // keep free defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  const isPremium = status.isPremium;
  const endingSoon = isPremium && status.daysLeft <= 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">{isPremium ? "👑" : "🌸"}</div>
          <h1 className="text-3xl font-bold text-gray-800">My HerBloom Plan</h1>
          <p className="mt-2 text-gray-600">View your current HerBloom subscription status.</p>
        </div>

        <div className="rounded-3xl border border-pink-200 bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Current Plan</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-800">{isPremium ? "HerBloom Premium" : "HerBloom Free"}</h2>
              <p className="mt-2 text-gray-600">
                {isPremium ? "You have access to Premium features." : "You are currently using the free HerBloom plan."}
              </p>
            </div>
            <div className={`rounded-2xl px-6 py-4 text-center ${isPremium ? "bg-gradient-to-r from-pink-100 to-purple-100" : "bg-gray-100"}`}>
              <div className="text-3xl">{isPremium ? "👑" : "🌸"}</div>
              <p className={`mt-1 text-sm font-bold ${isPremium ? "text-pink-700" : "text-gray-600"}`}>{isPremium ? "PREMIUM" : "FREE"}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Plan</p>
              <p className="mt-1 font-bold capitalize text-gray-800">{status.plan}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-1 font-bold text-gray-800">{isPremium ? "Active" : "Free"}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Premium until</p>
              <p className="mt-1 font-bold text-gray-800">{isPremium ? formatDate(status.subscription?.endDate) : "Not applicable"}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Days left</p>
              <p className="mt-1 font-bold text-gray-800">{isPremium ? status.daysLeft : "—"}</p>
            </div>
          </div>

          {isPremium ? (
            <div className={`mt-8 rounded-2xl border p-6 ${endingSoon ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
              <div className="flex gap-3">
                <span className="text-2xl">{endingSoon ? "⏳" : "✅"}</span>
                <div>
                  <h3 className={`font-bold ${endingSoon ? "text-yellow-800" : "text-green-800"}`}>
                    {endingSoon ? "Your Premium ends soon" : "Premium is active"}
                  </h3>
                  <p className={`mt-1 text-sm ${endingSoon ? "text-yellow-700" : "text-green-700"}`}>
                    Plans don't renew automatically. Extend any time — new days are added on top of what you have left.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/premium/plans")}
                className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
              >
                Extend Premium →
              </button>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 p-6">
              <h3 className="text-lg font-bold text-gray-800">Unlock HerBloom Premium 👑</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Explore the additional features available with HerBloom Premium.</p>
              <button
                onClick={() => navigate("/premium/plans")}
                className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
              >
                View Premium Plans →
              </button>
            </div>
          )}
        </div>

        {/* Payment history */}
        <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">🧾 Payment History</h2>
          {payments.length === 0 ? (
            <p className="mt-4 rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-500">No payments yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
                  <div>
                    <p className="font-semibold capitalize text-gray-800">
                      {p.purpose} · {formatGhs(p.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(p.paidAt || p.createdAt)}
                      {p.channel ? ` · ${p.channel.replace("_", " ")}` : ""} · Ref {p.reference}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => navigate("/premium")} className="text-sm font-semibold text-pink-600 hover:text-pink-700">
            ← Back to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumStatusPage;