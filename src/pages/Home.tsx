import SearchBar from "@/components/SearchBar";
import SubwayState from "@/components/SubwayState";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let defferedPrompt: BeforeInstallPromptEvent | null = null;

export default function Home() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      defferedPrompt = e;
      setIsInstallable(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const showPWAInstallPrompt = () => {
    if (defferedPrompt) {
      defferedPrompt.prompt();
      defferedPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("사용자가 설치를 수락함");
        } else {
          console.log("사용자가 설치를 거절함");
        }
        defferedPrompt = null;
        setIsInstallable(false);
      });
    }
  };
  useEffect(() => {
    // 서비스 워커 등록
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });

    // 푸시 알림 권한 요청
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      }
    });
  }, []);

  return (
    <div id="home" className="flex flex-col gap-16 max-w-[418px] w-full">
      {isInstallable && (
        <Button onClick={showPWAInstallPrompt}>PWA를 설치하세용</Button>
      )}

      <SearchBar />
      <SubwayState />
    </div>
  );
}
