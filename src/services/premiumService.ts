import apiClient from "../api/client";

export interface PremiumStatus {
  isPremium: boolean;
  plan: "free" | "monthly" | "yearly";
  expiresAt: string | null;
  daysLeft: number;
}

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string;
  badge?: string;
  savingsNote?: string;
}

export interface PlansResponse {
  plans: PremiumPlan[];
  features: string[];
}

export interface PaymentInitResponse {
  payment: {
    id: string;
    reference: string;
    amount: number;
    status: string;
  };
  authorizationUrl: string;
  accessCode: string;
}

export interface PaymentVerifyResponse {
  id: string;
  reference: string;
  amount: number;
  status: string;
  channel?: string;
  gatewayResponse?: {
    metadata?: {
      plan?: string;
    };
  };
}

const defaultStatus: PremiumStatus = {
  isPremium: false,
  plan: "free",
  expiresAt: null,
  daysLeft: 0,
};

/*
 * GET PREMIUM STATUS
 */
export const getPremiumStatus =
  async (): Promise<PremiumStatus> => {
    try {
      const response =
        await apiClient.get<{
          subscription: {
            endDate: string | null;
            plan: string;
          } | null;
          isPremium: boolean;
          daysLeft: number;
          plan: string;
        }>("/payments/subscription");

      const data = response.data;

      return {
        isPremium: Boolean(data.isPremium),

        plan:
          data.plan === "monthly" ||
          data.plan === "yearly"
            ? data.plan
            : "free",

        expiresAt:
          data.subscription?.endDate || null,

        daysLeft: Number(data.daysLeft) || 0,
      };
    } catch {
      return defaultStatus;
    }
  };

/*
 * GET PREMIUM PLANS
 */
export const getPlans =
  async (): Promise<PlansResponse> => {
    try {
      const response =
        await apiClient.get<PlansResponse>(
          "/payments/plans"
        );

      return response.data;
    } catch {
      return {
        plans: [],
        features: [],
      };
    }
  };

/*
 * INITIALIZE PAYMENT
 */
export const initializePayment = async (
  plan: string
): Promise<PaymentInitResponse> => {
  const response =
    await apiClient.post<PaymentInitResponse>(
      "/payments/initialize",
      {
        purpose: "subscription",
        plan,
      }
    );

  return response.data;
};

/*
 * VERIFY PAYMENT
 */
export const verifyPayment = async (
  reference: string
): Promise<PaymentVerifyResponse> => {
  const response =
    await apiClient.get<PaymentVerifyResponse>(
      `/payments/verify/${encodeURIComponent(
        reference
      )}`
    );

  return response.data;
};

/*
 * CANCEL SUBSCRIPTION
 */
export const cancelSubscription = async () => {
  const response =
    await apiClient.put(
      "/payments/subscription/cancel"
    );

  return response.data;
};

/*
 * BACKWARD COMPATIBILITY
 */
export const clearPremiumStatus = (): void => {
  // Premium status is now managed by the backend.
};

export const activatePremiumForTesting = (): void => {
  // Kept for backward compatibility.
};