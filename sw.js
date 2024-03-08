self.addEventListener("push", function (event) {
  const title = "push title";
  const options = {
    body: "안녕!",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
