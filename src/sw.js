// Workbox가 빌드 시 자동으로 생성한 미리 캐시할 파일 목록으로 대체할 위치입니다.
import { precacheAndRoute } from "workbox-precaching";
precacheAndRoute(self.__WB_MANIFEST);
self.__WB_MANIFEST;

// 설치 이벤트가 발생할 때 로그를 출력합니다.
self.addEventListener("install", (event) => {
  console.log("Service Worker 설치됨.", event);
  self.skipWaiting();
});

// 서비스 워커가 활성화될 때 로그를 출력합니다.
self.addEventListener("activate", (event) => {
  console.log("Service Worker 활성화됨.", event);
});

// 네트워크 요청을 캐치할 때 로그를 출력합니다.
self.addEventListener("fetch", (event) => {
  console.log("요청 캐치됨:", event.request.url);
});

self.addEventListener("push", (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    console.log("push data", data);

    const title = data.title || "My Subway 알림";
    const options = {
      body: data.body || "새로운 알림이 도착했습니다.",
      icon: "/icons/app_logo_192.webp",
      badge: "/icons/favicon.ico",
    };

    // Notification 지원 여부 체크
    if ("showNotification" in self.registration) {
      event.waitUntil(
        self.registration.showNotification(title, options).catch((error) => {
          console.error("Notification 표시 실패:", error);
        })
      );
    } else {
      console.log("이 브라우저에서는 Notification이 지원되지 않습니다.");
    }
  } catch (error) {
    console.error("Push 이벤트 처리 중 오류:", error);
  }
});
