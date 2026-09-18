export interface PremiumStatus {
  isPremium: boolean;
  plan: "free" | "monthly" | "yearly";
  expiresAt: string | null;
}

const PREMIUM_STATUS_KEY = "herbloomPremiumStatus";

const defaultStatus: PremiumStatus = {
  isPremium: false,
  plan: "free",
  expiresAt: null,
};

export const getPremiumStatus = (): PremiumStatus => {
  try {
    const savedStatus = localStorage.getItem(PREMIUM_STATUS_KEY);

    if (!savedStatus) {
      return defaultStatus;
    }

    const parsedStatus = JSON.parse(savedStatus) as PremiumStatus;

    return {
      isPremium: parsedStatus.isPremium === true,
      plan: parsedStatus.plan || "free",
      expiresAt: parsedStatus.expiresAt || null,
    };
  } catch {
    return defaultStatus;
  }
};

export const setPremiumStatus = (
  status: PremiumStatus
): void => {
  localStorage.setItem(
    PREMIUM_STATUS_KEY,
    JSON.stringify(status)
  );
};

export const clearPremiumStatus = (): void => {
  localStorage.removeItem(PREMIUM_STATUS_KEY);
};

export const activatePremiumForTesting = (
  plan: "monthly" | "yearly"
): void => {
  setPremiumStatus({
    isPremium: true,
    plan,
    expiresAt: null,
  });
};