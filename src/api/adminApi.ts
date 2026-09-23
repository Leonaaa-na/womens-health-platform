import apiClient from "./client";

export interface AdminStats {
  users: { total: number; newThisWeek: number; activeToday: number; deactivated: number };
  premium: { active: number; expiringSoon: number; conversionRate: number };
  revenue: { total: number; thisMonth: number; successfulPayments: number; pendingPayments: number };
  professionals: { total: number; pendingVerifications: number };
  activity: { appointments: number; upcomingAppointments: number; posts: number; consultations: number; activeReminders: number };
  messages: { new: number };
  signupsChart: { day: string; count: number }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  profile: { username: string | null; city: string | null; lifeStage: string | null } | null;
  premium: { plan: string; endDate: string } | null;
}

export interface AdminProfessional {
  id: string;
  name: string;
  specialty: string;
  hospital: string | null;
  city: string | null;
  licenseNumber?: string | null;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface AdminPayment {
  id: string;
  reference: string;
  amount: string | number;
  purpose: string;
  status: string;
  channel: string | null;
  paidAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

// ---------- API calls (return just `data`) ----------

export const getStats = async (): Promise<AdminStats> => (await apiClient.get("/admin/stats")).data.data;

export const getUsers = async (params: { search?: string; page?: number } = {}) =>
  (await apiClient.get("/admin/users", { params })).data.data as {
    users: AdminUser[];
    total: number;
    page: number;
    pages: number;
  };

export const setUserStatus = async (id: string, isActive: boolean) =>
  apiClient.put(`/admin/users/${id}/status`, { isActive });

export const getProfessionals = async (params: { status?: string } = {}): Promise<AdminProfessional[]> =>
  (await apiClient.get("/admin/professionals", { params })).data.data;

export const verifyProfessional = async (id: string, status: "verified" | "rejected" | "pending") =>
  apiClient.put(`/admin/professionals/${id}/verify`, { status });

export const getMessages = async (params: { status?: string } = {}): Promise<AdminMessage[]> =>
  (await apiClient.get("/admin/messages", { params })).data.data;

export const setMessageStatus = async (id: string, status: "new" | "read" | "replied") =>
  apiClient.put(`/admin/messages/${id}`, { status });

export const getPayments = async (params: { status?: string } = {}): Promise<AdminPayment[]> =>
  (await apiClient.get("/admin/payments", { params })).data.data;

// ---------- Helpers ----------

export const formatGhs = (amount: number | string) =>
  `GH₵${Number(amount || 0).toLocaleString("en-GH", { maximumFractionDigits: 2 })}`;

export const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const formatDateTime = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;