import { useCallback, useEffect, useState } from "react";

export default function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return "Notification" in window ? Notification.permission : "default";
  });

  const checkPermission = useCallback(() => {
    if ("Notification" in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      return currentPermission;
    }
    return "default";
  }, []);

  useEffect(() => {
    checkPermission();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(checkPermission, 100);
      }
    };

    const handleFocus = () => {
      setTimeout(checkPermission, 100);
    };

    // 주기적으로 권한 상태 확인 (1초마다)
    const intervalId = setInterval(() => {
      checkPermission();
    }, 1000);

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
      return "default";
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

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
