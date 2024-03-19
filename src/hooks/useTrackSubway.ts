import useSubscriptionInfoStore from "@/stores/subscriptionInfo";
import { useState } from "react";

const useTrackSubway = () => {
  const [trackingState, setTrackingState] = useState("");
  const subscriptionInfo = useSubscriptionInfoStore(
    (state) => state.subscriptionInfo
  );

  const trackSubway = async (subwayNumber: string) => {
    console.log("지하철 추적 전 유저 정보", subscriptionInfo);
    const accessToken = localStorage.getItem("at");
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/subscribe/subway`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          subwayNumber,
          subscriptionInfo,
        }),
        credentials: "include",
      }
    );
    const result = await response.json();
    console.log("result", result);
    setTrackingState(result);
  };

  return { trackingState, trackSubway };
};

export default useTrackSubway;
