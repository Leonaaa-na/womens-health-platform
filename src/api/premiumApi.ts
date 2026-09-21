import apiClient from "./client";

export interface Plan {
  id: "monthly" | "yearly";
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string;
  badge?: string;
  savingsNote?: string;
}

export interface SubscriptionInfo {
  subscription: {
    id: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
  } | null;
  isPremium: boolean;
  daysLeft: number;
  plan: string;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  amount: string | number;
  currency: string;
  purpose: string;
  status: "pending" | "success" | "failed" | "abandoned";
  channel: string | null;
  paidAt: string | null;
  createdAt: string;
}

// ---------- API calls (return just `data`) ----------

export const getPlans = async (): Promise<{ plans: Plan[]; features: string[] }> =>
  (await apiClient.get("/payments/plans")).data.data;

export const getMySubscription = async (): Promise<SubscriptionInfo> =>
  (await apiClient.get("/payments/subscription")).data.data;

export const startSubscriptionPayment = async (plan: string): Promise<{ authorizationUrl: string }> =>
  (await apiClient.post("/payments/initialize", { purpose: "subscription", plan })).data.data;

export const verifyPayment = async (reference: string): Promise<PaymentRecord> =>
  (await apiClient.get(`/payments/verify/${encodeURIComponent(reference)}`)).data.data;

export const getMyPayments = async (): Promise<PaymentRecord[]> => (await apiClient.get("/payments")).data.data;

// ---------- Shared content ----------

export const FREE_FEATURES = [
  "Period tracking",
  "Pregnancy tracking",
  "Health Library",
  "Healthcare Professionals",
  "Emergency Assistance",
  "Community",
  "Basic reminders (3 active)",
  "Appointment management",
];

// `available: false` = advertised as coming soon, not sold as included
export const PREMIUM_FEATURES = [
  { icon: "📊", title: "Advanced Cycle Insights", description: "Deeper insights from your cycle history, patterns and reports.", path: "/period-tracker/reports", available: true },
  { icon: "✨", title: "Personalized Health Insights", description: "Insights based on the health information you track.", path: "/period-tracker/reports", available: true },
  { icon: "🤰", title: "Advanced Pregnancy Insights", description: "Enhanced pregnancy tracking and development insights.", path: "/pregnancy-tracker", available: true },
  { icon: "📚", title: "Unlimited Saved Articles", description: "Save as many Health Library articles as you like (free: 5).", path: "/health-library/saved", available: true },
  { icon: "🧘🏾‍♀️", title: "Advanced Wellness Tracking", description: "Track more wellness information and see longer-term trends.", path: "/period-tracker/wellness", available: true },
  { icon: "🔔", title: "Advanced Reminders", description: "Unlimited reminders, plus daily, weekly and monthly repeats (free: 3, no repeats).", path: "/notifications/create", available: true },
  { icon: "🎓", title: "Premium Educational Content", description: "Read articles marked Premium in the Health Library.", path: "/health-library", available: true },
  { icon: "📋", title: "Enhanced Health History", description: "Your full tracking history, not just the last 3 months.", path: "/period-tracker/reports", available: true },
  { icon: "👩🏾‍⚕️", title: "Priority Consultation Access", description: "Priority access to healthcare consultations.", path: "/healthcare-professionals", available: false },
  { icon: "👥", title: "Premium Community Features", description: "Extra community tools for Premium members.", path: "/community", available: false },
];

// ---------- Helpers ----------

export const formatGhs = (amount: number | string) => `GH₵${Number(amount).toLocaleString("en-GH", { maximumFractionDigits: 2 })}`;

export const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;