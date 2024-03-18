import useSearchResultStore from "@/stores/searchResult";
import { useState } from "react";

const useTrackSubway = () => {
  const [trackingState, setTrackingState] = useState("");
  const userSubscriptionInfo = useSearchResultStore(
    (state) => state.userSubscriptionInfo
  );

  const trackSubway = async (subwayNumber: string) => {
    console.log("지하철 추적 전 유저 정보", userSubscriptionInfo);
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
          userSubscriptionInfo,
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
