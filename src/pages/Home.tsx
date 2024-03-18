/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBar from "@/components/SearchBar";
import SubwayState from "@/components/SubwayState";
import { Button } from "@/components/ui/button";
import useSubscriptionStatus from "@/hooks/useSubscriptionStatus";
import useSearchResultStore from "@/stores/searchResult";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let defferedPrompt: BeforeInstallPromptEvent | null = null;

export default function Home() {
  const [isInstallable, setIsInstallable] = useState(false);
  const setUserSubscriptionInfo = useSearchResultStore(
    (state) => state.setUserSubscriptionInfo
  );

  const { CheckSubscriptionStatus } = useSubscriptionStatus();

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

  const unSubscribeUser = async (subscription: PushSubscription) => {
    const unSubscribeStatus = await subscription.unsubscribe();
    if (unSubscribeStatus) {
      console.log("구독 취소에 성공하였습니다.");
    } else {
      console.log("구독 취소에 실패하였습니다.");
    }
  };

  useEffect(() => {
    console.log("service worker supported", "serviceWorker" in navigator);
    console.log("PushManager supported", "PushManager" in window);

    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker and Push is supported");

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

  const subscribeUser = async (swReg: ServiceWorkerRegistration) => {
    const subscription = await swReg.pushManager.getSubscription();
    if (subscription) {
      const subscriptionStatus = await CheckSubscriptionStatus(subscription);
      if (!subscriptionStatus) {
        // 구독 상태이지만 서버에는 정보가 없음
        // 연결을 해제하고 다시 구독해야 함.
        unSubscribeUser(subscription);
      } else {
        setUserSubscriptionInfo(subscription);
        return;
      }
    }

    const applicationServerKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    swReg.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })
      .then((subscription: PushSubscription) => {
        console.log("User is subscribed:", subscription);
        setUserSubscriptionInfo(subscription);
        const accessToken = localStorage.getItem("at");

        fetch(`${import.meta.env.VITE_API_ENDPOINT}/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(subscription),
          credentials: "include",
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
        console.log("Notification permission granted");
      } else {
        console.log("Notification permission denied.");
      }
    });
  };

  return (
    <div id="home" className="flex flex-col gap-16 max-w-[418px] w-full mt-4">
      {isInstallable && (
        <Button onClick={showPWAInstallPrompt}>PWA를 설치하세용</Button>
      )}
      <Button onClick={requestPushPermission}>푸시 알림 허용</Button>
      <SearchBar />
      <SubwayState />
    </div>
  );
}
