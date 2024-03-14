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
    console.log("service worker supported", "serviceWorker" in navigator);
    console.log("PushManager supported", "PushManager" in window);

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
      requestPushPermission();
    }
  }, []);

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
      <SearchBar />
      <SubwayState />
    </div>
  );
}
