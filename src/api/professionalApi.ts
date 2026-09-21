import apiClient from "./client";

export interface Professional {
  id: string;
  userId: string | null;
  name: string;
  title: string | null;
  specialty: string;
  hospital: string | null;
  city: string | null;
  bio: string | null;
  avatarUrl: string | null;
  yearsOfExperience: number | null;
  qualifications: string[];
  consultationAreas: string[];
  languages: string[];
  consultationFee: string | number;
  availableDays: string[];
  isAvailable: boolean;
  acceptsChat: boolean;
  rating: number;
  verificationStatus: "pending" | "verified" | "rejected";
  verifiedAt: string | null;
  isVerified: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string | null;
  createdAt: string;
  sender?: { id: string; name: string };
}

export interface Conversation {
  id: string;
  userId: string;
  professionalId: string;
  status: "active" | "closed";
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  unreadCount?: number;
  user?: { id: string; name: string };
  professional?: { id: string; name: string; specialty: string; userId: string | null };
}

// Backend wraps everything in { success, message, data } — these return just `data`

export const getProfessionals = async (params: { search?: string; specialty?: string } = {}) =>
  (await apiClient.get("/professionals", { params: { limit: 100, ...params } })).data.data as {
    professionals: Professional[];
    total: number;
  };

export const getSpecialties = async (): Promise<string[]> =>
  (await apiClient.get("/professionals/specialties")).data.data;

export const getProfessional = async (id: string): Promise<Professional> =>
  (await apiClient.get(`/professionals/${id}`)).data.data;

// Chat
export const startConversation = async (professionalId: string): Promise<Conversation> =>
  (await apiClient.post("/chat/conversations", { professionalId })).data.data;

export const getConversations = async (): Promise<Conversation[]> =>
  (await apiClient.get("/chat/conversations")).data.data;

export const getMessages = async (conversationId: string): Promise<ChatMessage[]> =>
  (await apiClient.get(`/chat/conversations/${conversationId}/messages`)).data.data.messages;

export const sendMessage = async (conversationId: string, content: string): Promise<ChatMessage> =>
  (await apiClient.post(`/chat/conversations/${conversationId}/messages`, { content })).data.data;

export const markConversationRead = async (conversationId: string) =>
  apiClient.put(`/chat/conversations/${conversationId}/read`);

// Display helpers

export const specialtyIcon = (specialty: string) =>
  specialty === "Psychologist"
    ? "🧠"
    : specialty === "Nutritionist / Dietitian"
    ? "🥗"
    : specialty === "Paediatrician"
    ? "👶"
    : specialty === "Midwife"
    ? "🤱🏾"
    : "👩🏾‍⚕️";

export const locationText = (p: Professional) => (p.city ? `${p.city}, Ghana` : "Ghana");

export const experienceText = (p: Professional) =>
  p.yearsOfExperience ? `${p.yearsOfExperience} years experience` : "Experienced professional";

export const availabilityText = (p: Professional) =>
  !p.isAvailable
    ? "Not taking new consultations"
    : p.availableDays.length
    ? `Available ${p.availableDays.join(", ")}`
    : "Available for consultation";

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

// Opens an external website in a new tab
export const openExternal = (url: string) => window.open(url, "_blank", "noopener,noreferrer");