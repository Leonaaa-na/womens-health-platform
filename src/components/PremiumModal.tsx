import { useNavigate } from "react-router-dom";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

const PremiumModal = ({
  isOpen,
  onClose,
  featureName = "This feature",
}: PremiumModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleViewPlans = () => {
    onClose();
    navigate("/premium/plans");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close Premium popup"
        >
          ×
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 text-4xl">
          👑
        </div>

        {/* Premium Badge */}
        <div className="mt-5 text-center">
          <span className="inline-flex rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-1.5 text-xs font-bold tracking-wide text-pink-700">
            HERBLOOM PREMIUM
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-center text-2xl font-bold text-gray-800">
          Unlock {featureName}
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          This feature is available with HerBloom Premium. Unlock
          additional tools and insights designed to support your
          health journey.
        </p>

        {/* Benefits */}
        <div className="mt-6 space-y-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-5">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span>✨</span>
            <span>Access advanced HerBloom features</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span>📊</span>
            <span>Get enhanced health insights</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span>🌸</span>
            <span>Unlock more personalized tools</span>
          </div>
        </div>

        {/* Buttons */}
        <button
          type="button"
          onClick={handleViewPlans}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:from-pink-600 hover:to-purple-700"
        >
          View Premium Plans →
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Maybe Later
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          You can close this message and continue using the
          available HerBloom features.
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;