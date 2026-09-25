/* HerBloom service worker — receives notifications when the app is closed */

// Show the notification the server pushed
self.addEventListener("push", (event) => {
  let payload = { title: "HerBloom", body: "You have a new notification", url: "/notifications" };

  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    if (event.data) payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: payload.tag || "herbloom",
      renotify: true,
      data: { url: payload.url || "/notifications" },
    })
  );
});

// Tapping it opens the right page — reusing an open tab if there is one
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/notifications";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// Take over straight away instead of waiting for every tab to close
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));