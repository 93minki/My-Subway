import { useState } from "react";

const useTrackSubway = () => {
  const [trackingState, setTrackingState] = useState("");

  const trackSubway = async (subwayNumber: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/subscribe/subway/${subwayNumber}`
    );
    const result = await response.json();
    console.log("result", result);
    setTrackingState(result);
  };

  return { trackingState, trackSubway };
};

export default useTrackSubway;
