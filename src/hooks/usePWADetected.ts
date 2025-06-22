/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

type AppDisplayMode = "browser" | "standalone-ios" | "standalone-android";

export const usePWADetected = () => {
  const [isPWADetected, setIsPWADetected] = useState(false);

  useEffect(() => {
    const isStandaloneDisplayMode = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIosStandalone = (window.navigator as any).standalone === true;

    const displayMode: AppDisplayMode = isIosStandalone
      ? "standalone-ios"
      : isStandaloneDisplayMode
        ? "standalone-android"
        : "browser";

    setIsPWADetected(displayMode !== "browser");
  }, []);

  return isPWADetected;
};
