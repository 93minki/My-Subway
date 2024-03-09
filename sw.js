self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "No payload";
  self.registration.showNotification("Test Push Notification", {
    body: data,
    icon: "/icon/app_logo_192.webp",
    badge: "/icon/app_logo_192.webp",
  });
});
