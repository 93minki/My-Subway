import useSearchResultStore from "@/stores/searchResult";
import { useState } from "react";

const useTrackSubway = () => {
  const [trackingState, setTrackingState] = useState("");
  const userSubscriptionInfo = useSearchResultStore(
    (state) => state.userSubscriptionInfo
  );

  const trackSubway = async (subwayNumber: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/subscribe/subway/${subwayNumber}`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subwayNumber,
          userSubscriptionInfo,
        }),
      }
    );
    const result = await response.json();
    console.log("result", result);
    setTrackingState(result);
  };

  return { trackingState, trackSubway };
};

export default useTrackSubway;
