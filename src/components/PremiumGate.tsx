import { useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import PremiumModal from "./PremiumModal";

interface PremiumGateProps {
  children: ReactNode;
  featureName?: string;
}

const PremiumGate = ({
  children,
  featureName = "This feature",
}: PremiumGateProps) => {
  const [showModal, setShowModal] = useState(false);
  const { premiumStatus, premiumLoading } = useAuth();

  if (premiumLoading) {
    return <>{children}</>;
  }

  if (premiumStatus.isPremium) {
    return <>{children}</>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="block w-full cursor-pointer text-left"
        aria-label={`Unlock ${featureName} with HerBloom Premium`}
      >
        <div className="relative overflow-hidden rounded-2xl">
          {/* Locked Feature */}
          <div className="pointer-events-none opacity-50">
            {children}
          </div>

          {/* Lock Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="mx-4 max-w-sm rounded-2xl border border-pink-200 bg-white p-6 text-center shadow-xl">
              <div className="mb-3 text-4xl">🔒</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-1.5 text-xs font-bold text-pink-700">
                👑 PREMIUM
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-800">
                {featureName}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                This feature is available with HerBloom Premium.
              </p>
              <p className="mt-3 text-xs font-semibold text-pink-600">
                Tap to learn more
              </p>
            </div>
          </div>
        </div>
      </button>

      {/* Premium Popup */}
      <PremiumModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        featureName={featureName}
      />
    </>
  );
};

export default PremiumGate;
