/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBar from "@/components/SearchBar";
import SubwayState from "@/components/SubwayState";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let defferedPrompt: BeforeInstallPromptEvent | null = null;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

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
    // 서비스 워커 및 푸시 관리자 지원 여부 확인
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker and Push is supported");

      // 서비스 워커 등록
      navigator.serviceWorker
        .register("/sw.js")
        .then((swReg: ServiceWorkerRegistration) => {
          console.log("Service Worker is registered", swReg);

          subscribeUser(swReg);
        })
        .catch((error: any) => {
          console.error("Service Worker Error", error);
        });
    } else {
      console.warn("Push messaging is not supported");
    }
  }, []);

  const subscribeUser = (swReg: ServiceWorkerRegistration) => {
    const applicationServerKey = urlBase64ToUint8Array(
      import.meta.env.VITE_VAPID_PUBLIC_KEY
    );
    swReg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })
      .then((subscription: PushSubscription) => {
        console.log("User is subscribed:", subscription);

        // TODO: 서버에 구독 정보를 보내 저장합니다.
        // 예: fetch('/subscribe', {method: 'POST', body: JSON.stringify(subscription)});
        fetch(`${import.meta.env.VITE_API_ENDPOINT}/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log(
              "Subscription was successfully sent to the server:",
              data
            );
          })
          .catch((error) => {
            console.error("Failed to send subscription to server:", error);
          });
      })
      .catch((err: any) => {
        console.log("Failed to subscribe the user: ", err);
      });
  };
  const requestPushPermission = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");

        // 사용자가 권한을 허용했다면, 서비스 워커 등록 및 구독을 진행할 수 있습니다.
        // 이 로직은 이미 구현된 subscribeUser 함수 내에서 처리될 수 있습니다.
        fetch(`${import.meta.env.VITE_API_ENDPOINT}/push`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 실제 요청에서는 서버에 저장된 구독 정보를 대상으로 푸시 알림을 보내도록 서버를 구성해야 합니다.
        })
          .then((response) => response.json())
          .then((data) => console.log("Push test response:", data))
          .catch((error) => console.error("Failed to send push test:", error));
      } else {
        console.log("Notification permission denied.");
        // 사용자가 권한을 거부했다면, 추가 알림 요청이나 UI 업데이트를 처리할 수 있습니다.
      }
    });
  };

  return (
    <div id="home" className="flex flex-col gap-16 max-w-[418px] w-full">
      {isInstallable && (
        <Button onClick={showPWAInstallPrompt}>PWA를 설치하세용</Button>
      )}
      <Button onClick={requestPushPermission}>푸시 알림 받기</Button>

      <SearchBar />
      <SubwayState />
    </div>
  );
}
