import apiClient from "./client";

export interface Facility {
  id: string;
  name: string;
  type: "hospital" | "clinic" | "maternity_home" | "pharmacy" | "ambulance" | "hotline" | "police" | "other";
  category: string | null;
  description: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  phone: string | null;
  emergencyPhone: string | null;
  latitude: number | null;
  longitude: number | null;
  is24Hours: boolean;
  services: string[];
  distanceKm?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
  isPrimary: boolean;
}

export interface EmergencyInfo {
  bloodGroup: string | null;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string[];
  isPregnant: boolean;
  pregnancyWeek: number | null;
  doctorName: string | null;
  doctorPhone: string | null;
  preferredHospital: string | null;
  notes: string | null;
}

export interface SosResult {
  alert: { id: string; status: string };
  contacts: EmergencyContact[];
  medicalInfo: EmergencyInfo;
  hotlines: Facility[];
  nearbyFacilities: Facility[];
  mapsLink: string | null;
}

const HOTLINE_TYPES = ["hotline", "ambulance", "police"];

// ---------- API calls (return just `data`) ----------

// Hospitals & clinics only (hotlines have their own call)
export const getFacilities = async (): Promise<Facility[]> => {
  const all: Facility[] = (await apiClient.get("/emergency/facilities")).data.data;
  return all.filter((f) => !HOTLINE_TYPES.includes(f.type));
};

export const getHotlines = async (): Promise<Facility[]> =>
  (await apiClient.get("/emergency/facilities/hotlines")).data.data;

export const getContacts = async (): Promise<EmergencyContact[]> =>
  (await apiClient.get("/emergency/contacts")).data.data;

export const createContact = async (input: { name: string; phone: string; relationship: string; isPrimary: boolean }) =>
  (await apiClient.post("/emergency/contacts", input)).data.data as EmergencyContact;

export const updateContact = async (id: string, input: Partial<EmergencyContact>) =>
  (await apiClient.put(`/emergency/contacts/${id}`, input)).data.data as EmergencyContact;

export const deleteContact = async (id: string) => apiClient.delete(`/emergency/contacts/${id}`);

export const getMedicalInfo = async (): Promise<EmergencyInfo> => (await apiClient.get("/emergency/info")).data.data;

export const updateMedicalInfo = async (input: Partial<EmergencyInfo>): Promise<EmergencyInfo> =>
  (await apiClient.put("/emergency/info", input)).data.data;

export const triggerSos = async (location: { latitude: number; longitude: number } | null): Promise<SosResult> =>
  (await apiClient.post("/emergency/alerts", { type: "sos", ...(location || {}) })).data.data;

export const resolveAlert = async (id: string) => apiClient.put(`/emergency/alerts/${id}/resolve`);

// ---------- Helpers ----------

// Starts a phone call (on phones) — a button instead of a tel: link
export const callNumber = (phone: string | null) => {
  if (!phone) return;
  window.location.href = `tel:${phone.replace(/\s/g, "")}`;
};

export const openDirections = (lat: number, lng: number) =>
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank", "noopener,noreferrer");

export const distanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Browser location, or null if refused / unavailable
export const getCurrentLocation = (): Promise<{ latitude: number; longitude: number } | null> =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });

// "Peanuts, penicillin" → ["Peanuts", "penicillin"]
export const toList = (text: string) =>
  text.split(",").map((s) => s.trim()).filter(Boolean);

export const apiErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;