import apiClient from "./client";

// The browser needs the key as raw bytes, not text
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

export const pushSupported = () =>
  "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

// iPhones only allow push once the app is added to the home screen
export const isIos = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
export const isInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as { standalone?: boolean }).standalone === true;

export const permission = (): NotificationPermission | "unsupported" =>
  pushSupported() ? Notification.permission : "unsupported";

const registerWorker = async () => {
  const existing = await navigator.serviceWorker.getRegistration();
  if (existing) return existing;
  return navigator.serviceWorker.register("/service-worker.js");
};

// Is this device already subscribed?
export const isSubscribed = async () => {
  if (!pushSupported()) return false;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return false;
    return !!(await reg.pushManager.getSubscription());
  } catch {
    return false;
  }
};

// Ask permission, then register this device with the server
export const enablePush = async (): Promise<{ ok: boolean; message: string }> => {
  if (!pushSupported()) return { ok: false, message: "This browser doesn't support notifications." };
  if (isIos() && !isInstalled()) {
    return { ok: false, message: "On iPhone, tap Share → Add to Home Screen first, then open HerBloom from there." };
  }

  const result = await Notification.requestPermission();
  if (result === "denied") {
    return { ok: false, message: "Notifications are blocked. Allow them in your browser settings for this site." };
  }
  if (result !== "granted") return { ok: false, message: "Permission wasn't granted." };

  const { publicKey, enabled } = (await apiClient.get("/push/public-key")).data.data;
  if (!enabled || !publicKey) return { ok: false, message: "Push isn't configured on the server yet." };

  const reg = await registerWorker();
  await navigator.serviceWorker.ready;

  const existing = await reg.pushManager.getSubscription();
  const subscription =
    existing ||
    (await reg.pushManager.subscribe({
      userVisibleOnly: true, // every push must show something — no silent tracking
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  const json = subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
  await apiClient.post("/push/subscribe", { endpoint: json.endpoint, keys: json.keys });

  return { ok: true, message: "Notifications are on for this device." };
};

export const disablePush = async (): Promise<{ ok: boolean; message: string }> => {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const subscription = reg && (await reg.pushManager.getSubscription());
    if (subscription) {
      await apiClient.post("/push/unsubscribe", { endpoint: subscription.endpoint }).catch(() => undefined);
      await subscription.unsubscribe();
    }
    return { ok: true, message: "Notifications are off for this device." };
  } catch {
    return { ok: false, message: "Could not turn notifications off." };
  }
};

export const sendTestPush = async (): Promise<string> => {
  const res = await apiClient.post("/push/test");
  return res.data.message as string;
};