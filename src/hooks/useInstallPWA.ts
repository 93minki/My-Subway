import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const useInstallPWA = () => {
  console.log("useInstallPWA Hook running");
  const [isInstallable, setIsInstallable] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs((prev) => [...prev.slice(-9), logMessage]); // 최대 10개까지만 유지
  };

  useEffect(() => {
    addDebugLog("useInstallPWA Hook 초기화 시작");

    // PWA 설치 가능성 체크
    const checkPWAInstallability = () => {
      // Service Worker 지원 체크
      if ("serviceWorker" in navigator) {
        addDebugLog("ServiceWorker 지원됨");
      } else {
        addDebugLog("ServiceWorker 지원되지 않음");
      }

      // 이미 설치된 앱인지 체크
      if (window.matchMedia("(display-mode: standalone)").matches) {
        addDebugLog("이미 PWA로 설치되어 실행 중");
      } else {
        addDebugLog("브라우저에서 실행 중 (PWA 미설치)");
      }

      // 사용자 에이전트 로그
      addDebugLog(`User Agent: ${navigator.userAgent.substring(0, 100)}...`);
    };

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      addDebugLog("beforeinstallprompt 이벤트 발생!");
      e.preventDefault();
      promptRef.current = e;
      setIsInstallable(true);
      addDebugLog("PWA 설치 가능 상태로 변경됨");
    };

    // PWA가 이미 설치되었는지 체크
    const handleAppInstalled = () => {
      addDebugLog("PWA가 설치됨 (appinstalled 이벤트)");
      setIsInstallable(false);
      promptRef.current = null;
    };

    checkPWAInstallability();

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    // 3초 후에도 beforeinstallprompt가 발생하지 않으면 로그 추가
    const timeoutId = setTimeout(() => {
      if (!isInstallable) {
        addDebugLog("3초 경과: beforeinstallprompt 이벤트가 발생하지 않음");
        addDebugLog(
          "가능한 원인: 이미 설치됨, HTTPS 아님, 매니페스트 문제, 또는 브라우저 제한"
        );
      }
    }, 3000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timeoutId);
    };
  }, []);

  const showInstallPrompt = useCallback(() => {
    if (promptRef.current) {
      addDebugLog("PWA 설치 프롬프트 표시 시도");
      promptRef.current.prompt();
      promptRef.current.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          addDebugLog("사용자가 설치를 수락함");
        } else {
          addDebugLog("사용자가 설치를 거절함");
        }
        promptRef.current = null;
        setIsInstallable(false);
      });
    } else {
      addDebugLog("설치 프롬프트가 없음 - 설치할 수 없는 상태");
    }
  }, []);

  const getDebugInfo = () => {
    return {
      isInstallable,
      hasPrompt: !!promptRef.current,
      logs: debugLogs,
      isStandalone: window.matchMedia("(display-mode: standalone)").matches,
      isServiceWorkerSupported: "serviceWorker" in navigator,
    };
  };

  return { isInstallable, showInstallPrompt, getDebugInfo };
};

export default useInstallPWA;
