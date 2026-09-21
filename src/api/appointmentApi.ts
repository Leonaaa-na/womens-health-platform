import apiClient from "./client";

export type BackendStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
export type UiStatus = "Upcoming" | "Completed" | "Cancelled" | "Missed";

export interface AppointmentHistoryItem {
  id: string;
  action: "booked" | "confirmed" | "rescheduled" | "cancelled" | "completed";
  previousScheduledAt: string | null;
  newScheduledAt: string | null;
  reason: string | null;
  createdAt: string;
}

export interface Appointment {
  id: string;
  professionalId: string | null;
  providerName: string | null; // personal appointments
  isPersonal: boolean;
  scheduledAt: string;
  durationMinutes: number;
  type: "in_person" | "virtual" | "phone";
  context: string;
  reason: string | null; // we store the consultation type label here
  status: BackendStatus;
  location: string | null;
  notes: string | null;
  cancellationReason: string | null;
  professional: {
    id: string;
    name: string;
    specialty: string;
    hospital: string | null;
    city: string | null;
  } | null;
  history?: AppointmentHistoryItem[];
  createdAt: string;
}

export const CONSULTATION_TYPES = [
  { label: "Consultation Chat", type: "virtual" },
  { label: "General Consultation", type: "in_person" },
  { label: "Follow-up Consultation", type: "in_person" },
] as const;

export const AVAILABLE_TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// "1:00 PM" → "13:00"
export const to24h = (label: string) => {
  const [hm, period] = label.split(" ");
  let [h] = hm.split(":").map(Number);
  const m = hm.split(":")[1];
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m}`;
};

// ISO date-time → "1:00 PM"
export const toSlotLabel = (iso: string) => {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
};

// ISO date-time → "2026-09-21" (for date inputs)
export const toDateInput = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const toScheduledAt = (date: string, time: string) => `${date}T${to24h(time)}:00`;

// ---------- API calls (return just `data`) ----------

export const getMyAppointments = async (): Promise<Appointment[]> =>
  (await apiClient.get("/appointments", { params: { status: "all" } })).data.data;

export const getAppointment = async (id: string): Promise<Appointment> =>
  (await apiClient.get(`/appointments/${id}`)).data.data;

export const bookAppointment = async (input: {
  professionalId: string;
  date: string;
  time: string;
  consultationType: string;
}): Promise<Appointment> => {
  const match = CONSULTATION_TYPES.find((c) => c.label === input.consultationType);
  return (
    await apiClient.post("/appointments", {
      professionalId: input.professionalId,
      scheduledAt: toScheduledAt(input.date, input.time),
      type: match ? match.type : "in_person",
      reason: input.consultationType,
    })
  ).data.data;
};

export const rescheduleAppointment = async (id: string, date: string, time: string): Promise<Appointment> =>
  (await apiClient.put(`/appointments/${id}/reschedule`, { scheduledAt: toScheduledAt(date, time) })).data.data;

export const cancelAppointment = async (id: string, reason: string): Promise<Appointment> =>
  (await apiClient.put(`/appointments/${id}/cancel`, { reason: reason || undefined })).data.data;

// Slots already taken for that professional on that day, as "10:00 AM" labels
export const getBookedSlots = async (professionalId: string, date: string): Promise<string[]> => {
  const data = (await apiClient.get("/appointments/availability", { params: { professionalId, date } })).data.data;
  return (data.booked || []).map((b: { scheduledAt: string }) => toSlotLabel(b.scheduledAt));
};

// ---------- Display helpers ----------

export const uiStatus = (a: Appointment): UiStatus => {
  if (a.status === "completed") return "Completed";
  if (a.status === "cancelled") return "Cancelled";
  return new Date(a.scheduledAt) < new Date() ? "Missed" : "Upcoming";
};

export const professionalName = (a: Appointment) => a.professional?.name || a.providerName || "Healthcare appointment";

export const specialtyOf = (a: Appointment) =>
  a.professional?.specialty || (a.isPersonal ? "Personal appointment" : "Healthcare professional");

export const consultationLabel = (a: Appointment) => {
  if (a.reason && CONSULTATION_TYPES.some((c) => c.label === a.reason)) return a.reason;
  return a.type === "virtual" ? "Virtual consultation" : a.type === "phone" ? "Phone consultation" : "In-person consultation";
};

export const isAwaitingConfirmation = (a: Appointment) =>
  uiStatus(a) === "Upcoming" && (a.status === "pending" || a.status === "rescheduled");

export const formatDate = (iso: string, style: "short" | "long" = "short") =>
  new Date(iso).toLocaleDateString("en-GB", {
    ...(style === "long" ? { weekday: "long" } : {}),
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });

export const statusStyle = (status: UiStatus) =>
  status === "Upcoming"
    ? "bg-pink-100 text-pink-700"
    : status === "Completed"
    ? "bg-green-100 text-green-700"
    : status === "Cancelled"
    ? "bg-gray-100 text-gray-600"
    : "bg-orange-100 text-orange-700";

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;