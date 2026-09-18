import { useNavigate } from "react-router-dom";
import PremiumGate from "../../components/PremiumGate";

const PremiumFeatures = () => {
  const navigate = useNavigate();

  const premiumFeatures = [
    {
      icon: "📊",
      title: "Advanced Cycle Insights",
      description:
        "Get deeper insights from your cycle history, patterns, and reports.",
    },
    {
      icon: "✨",
      title: "Personalized Health Insights",
      description:
        "Receive personalized insights based on the health information you track.",
    },
    {
      icon: "🤰",
      title: "Advanced Pregnancy Insights",
      description:
        "Explore enhanced pregnancy tracking and development insights.",
    },
    {
      icon: "📚",
      title: "Unlimited Saved Articles",
      description:
        "Save and organize your favorite HerBloom health articles.",
    },
    {
      icon: "👩🏾‍⚕️",
      title: "Priority Consultation Access",
      description:
        "Get priority access to selected healthcare consultation features.",
    },
    {
      icon: "🧘🏾‍♀️",
      title: "Advanced Wellness Tracking",
      description:
        "Track more wellness information and view deeper wellness insights.",
    },
    {
      icon: "🔔",
      title: "Advanced Reminders",
      description:
        "Unlock enhanced reminder and notification options.",
    },
    {
      icon: "🎓",
      title: "Premium Educational Content",
      description:
        "Access additional educational resources available to Premium members.",
    },
    {
      icon: "📋",
      title: "Enhanced Health History",
      description:
        "View and organize a more detailed history of your tracked information.",
    },
    {
      icon: "👥",
      title: "Premium Community Features",
      description:
        "Access additional community features as they become available.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <div className="mb-3 text-5xl">👑</div>

          <h1 className="text-3xl font-bold text-gray-800">
            HerBloom Premium Features
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Unlock additional tools and enhanced features designed to
            give you a richer HerBloom experience.
          </p>
        </div>

        <div className="mb-8 rounded-3xl border border-pink-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Premium Features
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                These features require an active Premium subscription.
              </p>
            </div>

            <button
              onClick={() => navigate("/premium/plans")}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
            >
              View Premium Plans →
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {premiumFeatures.map((feature) => (
            <PremiumGate
              key={feature.title}
              featureName={feature.title}
            >
              <div className="h-full rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-3xl">
                    {feature.icon}
                  </div>

                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">
                    PREMIUM
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </div>
            </PremiumGate>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold">
            Unlock the full HerBloom experience 💕
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-pink-50">
            Explore Premium plans to see the additional features available.
          </p>

          <button
            onClick={() => navigate("/premium/plans")}
            className="mt-5 rounded-xl bg-white px-7 py-3 font-bold text-pink-600 transition hover:bg-pink-50"
          >
            Explore Premium →
          </button>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-gray-500">
          Premium features are subject to availability and may change as
          HerBloom develops. Health information provided through HerBloom
          should not replace professional medical advice.
        </p>

      </div>
    </div>
  );
};

export default PremiumFeatures;