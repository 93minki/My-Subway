/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBar from "@/components/SearchBar";
import SubwayState from "@/components/SubwayState";
import { Button } from "@/components/ui/button";
import useSearchResultStore from "@/stores/searchResult";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let defferedPrompt: BeforeInstallPromptEvent | null = null;

export default function Home() {
  const [isInstallable, setIsInstallable] = useState(false);
  const userSubscriptionInfo = useSearchResultStore(
    (state) => state.userSubscriptionInfo
  );
  const setUserSubscriptionInfo = useSearchResultStore(
    (state) => state.setUserSubscriptionInfo
  );

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
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker and Push is supported");

      navigator.serviceWorker
        .register("/sw.js")
        .then((swReg: ServiceWorkerRegistration) => {
          console.log("Service Worker is registered", swReg);
          console.log("scope", swReg.scope);
          subscribeUser(swReg);
        })
        .catch((error: any) => {
          console.error("Service Worker Error", error);
        });
    } else {
      console.warn("Push messaging is not supported");
    }
  }, []);

  // const unsubsribeUser = async (swReg: ServiceWorkerRegistration) => {
  //   const subscription = await swReg.pushManager.getSubscription();

  //   if (subscription) {
  //     const successful = await subscription.unsubscribe();
  //     if (successful) {
  //       console.log("구독 취소");
  //     } else {
  //       console.log("구독 취소 실패");
  //     }
  //   } else {
  //     console.log("구독 상태가 아님");
  //   }
  // };

  const subscribeUser = async (swReg: ServiceWorkerRegistration) => {
    const subscription = await swReg.pushManager.getSubscription();
    console.log("subscription", subscription);

    if (subscription) {
      console.log("이미 구독중임!");
      setUserSubscriptionInfo(subscription);
      return;
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
        alert("알림 권한을 거절하였습니다. 허용해야 하는데...");
      });
  };

  const pushNotificationTest = () => {
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription: userSubscriptionInfo }),
      // 실제 요청에서는 서버에 저장된 구독 정보를 대상으로 푸시 알림을 보내도록 서버를 구성해야 합니다.
    })
      .then((response) => response.json())
      .then((data) => console.log("Push test response:", data))
      .catch((error) => console.error("Failed to send push test:", error));
  };

  return (
    <div id="home" className="flex flex-col gap-16 max-w-[418px] w-full">
      {isInstallable && (
        <Button onClick={showPWAInstallPrompt}>PWA를 설치하세용</Button>
      )}
      <Button onClick={pushNotificationTest}>푸시 알림 테스트</Button>
      <SearchBar />
      <SubwayState />
    </div>
  );
}
