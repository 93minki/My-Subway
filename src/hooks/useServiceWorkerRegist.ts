import useSubscriptionInfoStore from "@/stores/subscriptionInfo";
import { useCallback, useEffect } from "react";
import useSubscriptionStatus from "./useSubscriptionStatus";

const useServiceWorkerRegist = () => {
  const { CheckSubscriptionStatus } = useSubscriptionStatus();
  const setSubscriptionInfo = useSubscriptionInfoStore(
    (state) => state.setSubscriptionInfo
  );

  const unSubscribePushManager = useCallback(
    async (subscription: PushSubscription) => {
      const unSubscribeResult = await subscription.unsubscribe();
      if (unSubscribeResult) {
        console.log("구독 취소에 성공했습니다.");
      } else {
        console.log("구독 취소에 실패했습니다.");
      }
    },
    []
  );

  const subscribePushManager = useCallback(
    (swReg: ServiceWorkerRegistration) => {
      const applicationServerKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

      swReg.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        })
        .then((subscription: PushSubscription) => {
          setSubscriptionInfo(subscription);
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
        .catch((err: Error) => {
          console.log("Failed to subscribe the user: ", err);
        });
    },
    [setSubscriptionInfo]
  );

  const syncPushManagerSubscription = useCallback(
    async (swReg: ServiceWorkerRegistration) => {
      const subscriptionInfo = await swReg.pushManager.getSubscription();
      if (subscriptionInfo) {
        // 푸시매니저 구독 정보가 있음 (이전에 이미 구독을 한 상태)
        const subscriptionExists = await CheckSubscriptionStatus(
          subscriptionInfo
        );
        if (subscriptionExists) {
          // 서버에 저장되어있는 구독정보와 현재 구독정보가 일치함
          setSubscriptionInfo(subscriptionInfo);
        } else {
          // 서버에 저장되어있는 구독정보와 현재 구독정보가 일치하지 않음.
          // 서버에 저장되어있는 구독정보를 삭제하고 현재 구독정보로 업데이트 요청해야 함.
          await unSubscribePushManager(subscriptionInfo);
          subscribePushManager(swReg);
        }
      } else {
        // 새로 푸시매니저를 구독해야 함 (이전에 구독 정보가 없는 상태)
        subscribePushManager(swReg);
      }
    },
    []
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("서비스워커, 푸시매니저 모두 지원");

      navigator.serviceWorker
        .register("./sw.js")
        .then((swReg: ServiceWorkerRegistration) => {
          syncPushManagerSubscription(swReg);
        })
        .catch((error: Error) => {
          console.error("서비스 워커 등록중 에러 발생:", error);
        });
    } else {
      console.log("서비스워커 지원 여부", "serviceWorker" in navigator);
      console.log("푸시매니저 지원 여부", "PushManager" in window);
    }
  }, []);
};

export default useServiceWorkerRegist;
