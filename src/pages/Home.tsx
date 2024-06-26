/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import SubwayLineTabs from "@/components/SubwayLineTabs";
import { Button } from "@/components/ui/button";
import useInstallPWA from "@/hooks/useInstallPWA";
import useServiceWorkerRegist from "@/hooks/useServiceWorkerRegist";
import { isIOS, isMobileSafari, isSafari } from "react-device-detect";

export default function Home() {
  const { isInstallable, showInstallPrompt } = useInstallPWA();

  useServiceWorkerRegist();

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
        <Button onClick={showInstallPrompt}>PWA를 설치하세용</Button>
      )}
      <div className="flex flex-col justify-center">
        {Notification.permission !== "granted" && (
          <>
            {isSafari ||
              isMobileSafari ||
              (isIOS && (
                <span className="self-center text-sm text-red-500">
                  iOS는 반드시 알림 허용 버튼을 눌러야 합니다.
                </span>
              ))}
            <Button onClick={requestPushPermission}>푸시 알림 허용</Button>
          </>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <SearchBar />
        <SearchHistory />
      </div>
      <SubwayLineTabs />
    </div>
  );
}
