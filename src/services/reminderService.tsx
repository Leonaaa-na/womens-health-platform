import apiClient from "../api/client";

export type ReminderType = "period" | "pregnancy" | "medication" | "appointment" | "wellness" | "custom";
export type RepeatType = "none" | "daily" | "weekly" | "monthly";

export interface HerBloomReminder {
  id: string;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  notes: string;
  completed: boolean;
  automatic: boolean;
  repeat: RepeatType;
}

const typeLabelMap: Record<string, string> = {
  period: "🩸",
  pregnancy: "🤰",
  medication: "💊",
  appointment: "📅",
  wellness: "🌸",
  custom: "🔔",
};

export const getIconForType = (type: string): string => typeLabelMap[type] || "🔔";

export const fetchReminders = async (params?: Record<string, string>): Promise<HerBloomReminder[]> => {
  const response = await apiClient.get<HerBloomReminder[]>("/reminders", { params });
  return response.data.data;
};

export const fetchUpcomingReminders = async (): Promise<HerBloomReminder[]> => {
  return fetchReminders({ upcoming: "true" });
};

export const createReminder = async (data: {
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  notes?: string;
  repeat?: RepeatType;
}): Promise<HerBloomReminder> => {
  const response = await apiClient.post<HerBloomReminder>("/reminders", data);
  return response.data.data;
};

export const updateReminder = async (id: string, data: Partial<HerBloomReminder>): Promise<HerBloomReminder> => {
  const response = await apiClient.put<HerBloomReminder>(`/reminders/${id}`, data);
  return response.data.data;
};

export const toggleReminderComplete = async (id: string): Promise<HerBloomReminder> => {
  const response = await apiClient.put<HerBloomReminder>(`/reminders/${id}/complete`);
  return response.data.data;
};

export const deleteReminder = async (id: string): Promise<void> => {
  await apiClient.delete(`/reminders/${id}`);
};

export const syncAutomaticReminders = async (): Promise<HerBloomReminder[]> => {
  const response = await apiClient.post("/reminders/sync");
  return (response.data.data as HerBloomReminder[]) || [];
};

// Backward compatibility — no-op
export const clearPremiumStatus = (): void => {};
export const activatePremiumForTesting = (): void => {};
