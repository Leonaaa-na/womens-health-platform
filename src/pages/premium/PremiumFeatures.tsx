import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMySubscription, PREMIUM_FEATURES } from "../../api/premiumApi";

const PremiumFeatures = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    getMySubscription()
      .then((s) => setIsPremium(s.isPremium))
      .catch(() => setIsPremium(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <div className="mb-3 text-5xl">👑</div>
          <h1 className="text-3xl font-bold text-gray-800">HerBloom Premium Features</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            {isPremium
              ? "Everything below is unlocked for you. Tap a feature to go straight to it."
              : "Unlock additional tools and enhanced features for a richer HerBloom experience."}
          </p>
        </div>

        {!isPremium ? (
          <div className="mb-8 rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Premium Features</h2>
                <p className="mt-1 text-sm text-gray-600">These features need an active Premium plan.</p>
              </div>
              <button
                onClick={() => navigate("/premium/plans")}
                className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
              >
                View Premium Plans →
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PREMIUM_FEATURES.map((f) => {
            const canOpen = isPremium && f.available;
            return (
              <button
                key={f.title}
                type="button"
                onClick={() => (canOpen ? navigate(f.path) : !isPremium ? navigate("/premium/plans") : undefined)}
                disabled={isPremium && !f.available}
                className="h-full rounded-3xl border border-pink-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md disabled:cursor-default disabled:hover:translate-y-0"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-3xl">
                    {f.icon}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      !f.available
                        ? "bg-gray-100 text-gray-500"
                        : isPremium
                        ? "bg-green-100 text-green-700"
                        : "bg-pink-100 text-pink-600"
                    }`}
                  >
                    {!f.available ? "COMING SOON" : isPremium ? "✓ UNLOCKED" : "🔒 PREMIUM"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{f.description}</p>
                {canOpen ? <p className="mt-3 text-sm font-semibold text-pink-600">Open →</p> : null}
              </button>
            );
          })}
        </div>

        {!isPremium ? (
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-center text-white shadow-lg">
            <h2 className="text-2xl font-bold">Unlock the full HerBloom experience 💕</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-pink-50">Explore Premium plans to see what's included.</p>
            <button
              onClick={() => navigate("/premium/plans")}
              className="mt-5 rounded-xl bg-white px-7 py-3 font-bold text-pink-600 transition hover:bg-pink-50"
            >
              Explore Premium →
            </button>
          </div>
        ) : null}

        <p className="mt-8 text-center text-xs leading-5 text-gray-500">
          Features marked "Coming soon" aren't included yet and will be added to Premium at no extra cost. Health information
          in HerBloom does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default PremiumFeatures;