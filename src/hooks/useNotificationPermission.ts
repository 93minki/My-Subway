import { useCallback, useEffect, useState } from "react";

export default function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return "Notification" in window ? Notification.permission : "default";
  });

  const checkPermission = useCallback(() => {
    if ("Notification" in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      console.log(
        `[NotificationPermission] Current permission: ${currentPermission}`
      );
      return currentPermission;
    }
    return "default";
  }, []);

  useEffect(() => {
    // 초기 권한 상태 확인
    checkPermission();

    // 앱이 포커스를 받을 때마다 권한 상태 재확인
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log(
          "[NotificationPermission] App became visible, checking permission..."
        );
        setTimeout(checkPermission, 100); // 약간의 지연을 주어 상태 변경을 확실히 감지
      }
    };

    const handleFocus = () => {
      console.log(
        "[NotificationPermission] App focused, checking permission..."
      );
      setTimeout(checkPermission, 100);
    };

    // 주기적으로 권한 상태 확인 (1초마다)
    const intervalId = setInterval(() => {
      checkPermission();
    }, 1000);

    // 이벤트 리스너 등록
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      clearInterval(intervalId);
    };
  }, [checkPermission]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("이 브라우저는 Notification을 지원하지 않습니다.");
      return "default";
    }

    try {
      console.log("[NotificationPermission] Requesting permission...");
      const result = await Notification.requestPermission();
      console.log(`[NotificationPermission] Permission result: ${result}`);

      // 권한 요청 후 상태 업데이트
      setPermission(result);

      // 약간의 지연 후 다시 한번 확인 (iOS에서 지연될 수 있음)
      setTimeout(() => {
        checkPermission();
      }, 500);

      return result;
    } catch (error) {
      console.error("알림 권한 요청 중 오류:", error);
      return "default";
    }
  }, [checkPermission]);

  return {
    permission,
    isSupported: "Notification" in window,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
    requestPermission,
    checkPermission,
  };
}
