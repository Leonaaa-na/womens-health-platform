import apiClient from "./client";

export type ReminderType = "period" | "pregnancy" | "medication" | "appointment" | "wellness" | "custom";
export type RepeatType = "none" | "daily" | "weekly" | "monthly";

export interface Reminder {
  id: string;
  title: string;
  type: ReminderType;
  date: string; // "2026-09-21"
  time: string; // "08:30"
  notes: string | null;
  repeat: RepeatType;
  completed: boolean;
  automatic: boolean;
  referenceId: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  isRead: boolean;
  data: Record<string, string> | null;
  createdAt: string;
}

export interface NotificationSettings {
  notificationsEnabled: boolean;
  periodNotifications: boolean;
  pregnancyNotifications: boolean;
  medicationNotifications: boolean;
  appointmentNotifications: boolean;
  wellnessNotifications: boolean;
  notificationSound: boolean;
  vibration: boolean;
  emailNotifications: boolean;
  reminderLeadMinutes: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export const DEFAULT_SETTINGS: NotificationSettings = {
  notificationsEnabled: true,
  periodNotifications: true,
  pregnancyNotifications: true,
  medicationNotifications: true,
  appointmentNotifications: true,
  wellnessNotifications: true,
  notificationSound: true,
  vibration: true,
  emailNotifications: true,
  reminderLeadMinutes: 0,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

export const REMINDER_TYPES: { value: ReminderType; label: string }[] = [
  { value: "custom", label: "General" },
  { value: "period", label: "Period" },
  { value: "pregnancy", label: "Pregnancy" },
  { value: "medication", label: "Medication" },
  { value: "appointment", label: "Appointment" },
  { value: "wellness", label: "Wellness" },
];

export const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
];

// ---------- Reminders ----------

export const getReminders = async (params: { completed?: string; upcoming?: string } = {}): Promise<Reminder[]> =>
  (await apiClient.get("/reminders", { params })).data.data;

export const getReminder = async (id: string): Promise<Reminder> => (await apiClient.get(`/reminders/${id}`)).data.data;

export const createReminder = async (input: Partial<Reminder>): Promise<Reminder> =>
  (await apiClient.post("/reminders", input)).data.data;

export const updateReminder = async (id: string, input: Partial<Reminder>): Promise<Reminder> =>
  (await apiClient.put(`/reminders/${id}`, input)).data.data;

export const toggleReminderComplete = async (id: string): Promise<Reminder> =>
  (await apiClient.put(`/reminders/${id}/complete`)).data.data;

export const deleteReminder = async (id: string) => apiClient.delete(`/reminders/${id}`);

// Creates/refreshes period, appointment and medication reminders for me
export const syncReminders = async () => apiClient.post("/reminders/sync");

// ---------- Notifications ----------

export const getNotifications = async (): Promise<AppNotification[]> =>
  (await apiClient.get("/notifications", { params: { limit: 100 } })).data.data;

export const markNotificationRead = async (id: string) => apiClient.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = async () => apiClient.put("/notifications/read-all");
export const deleteNotification = async (id: string) => apiClient.delete(`/notifications/${id}`);
export const clearNotifications = async () => apiClient.delete("/notifications");

// ---------- Settings ----------

export const getNotificationSettings = async (): Promise<NotificationSettings> =>
  ({ ...DEFAULT_SETTINGS, ...(await apiClient.get("/users/notification-settings")).data.data });

export const updateNotificationSettings = async (input: Partial<NotificationSettings>): Promise<NotificationSettings> =>
  ({ ...DEFAULT_SETTINGS, ...(await apiClient.put("/users/notification-settings", input)).data.data });

// ---------- Display helpers ----------

export const typeIcon = (type: string) =>
  ({
    period: "🩸",
    pregnancy: "🤰",
    medication: "💊",
    appointment: "📅",
    wellness: "🌸",
    community: "💬",
    message: "✉️",
    payment: "💳",
    emergency: "🚨",
  } as Record<string, string>)[type] || "🔔";

export const typeLabel = (type: string) =>
  REMINDER_TYPES.find((t) => t.value === type)?.label || type.charAt(0).toUpperCase() + type.slice(1);

// "2026-09-21" → "Today" / "Tomorrow" / "Mon 28 Sep 2026"
export const friendlyDate = (date: string) => {
  const d = new Date(`${date}T00:00:00`);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - todayStart.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

// "13:05" → "1:05 PM"
export const friendlyTime = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const timeAgo = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// Where tapping a notification should take you
export const notificationLink = (n: AppNotification): string | null => {
  const d = n.data || {};
  if (d.appointmentId) return `/appointments/${d.appointmentId}`;
  if (d.postId) return `/community/comments?post=${d.postId}`;
  if (d.reminderId) return "/notifications/reminders";
  if (n.type === "payment") return "/premium/status";
  return null;
};

export const todayInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

export const isUpgradeError = (error: unknown) =>
  !!(error as { response?: { data?: { upgradeRequired?: boolean } } }).response?.data?.upgradeRequired;