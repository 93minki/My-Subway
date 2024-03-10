self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("push data", data);
  const title = data.title || "Fallback Title";
  const options = {
    body: data.body || "Fallback body",
    icon: "/icon/app_logo_192.webp",
    badge: "/icon/app_logo_192.webp",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
