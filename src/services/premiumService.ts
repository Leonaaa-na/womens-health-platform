import apiClient, { ApiErrorResponse } from "../api/client";

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

export const getPremiumStatus = async (): Promise<PremiumStatus> => {
  try {
    const response = await apiClient.get<{
      subscription: { endDate: string | null; plan: string } | null;
      isPremium: boolean;
      daysLeft: number;
      plan: string;
    }>("/payments/subscription");

    const data = response.data.data;
    return {
      isPremium: data.isPremium,
      plan: data.plan as "free" | "monthly" | "yearly",
      expiresAt: data.subscription?.endDate || null,
      daysLeft: data.daysLeft,
    };
  } catch {
    return defaultStatus;
  }
};

export const getPlans = async (): Promise<{ plans: PremiumPlan[]; features: string[] }> => {
  try {
    const response = await apiClient.get<PlansResponse>("/payments/plans");
    return response.data.data;
  } catch {
    return { plans: [], features: [] };
  }
};

export const initializePayment = async (plan: string): Promise<PaymentInitResponse> => {
  const response = await apiClient.post<PaymentInitResponse>("/payments/initialize", {
    purpose: "subscription",
    plan,
  });
  return response.data.data;
};

export const verifyPayment = async (reference: string): Promise<PaymentVerifyResponse> => {
  const response = await apiClient.get<PaymentVerifyResponse>(`/payments/verify/${encodeURIComponent(reference)}`);
  return response.data.data;
};

export const cancelSubscription = async () => {
  const response = await apiClient.put("/payments/subscription/cancel");
  return response.data;
};

export const clearPremiumStatus = (): void => {
  // No-op — premium status is now server-side
};

export const activatePremiumForTesting = (): void => {
  // No-op — kept for backward compatibility
};
