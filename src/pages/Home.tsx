/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBar from "@/components/SearchBar";
import SubwayState from "@/components/SubwayState";
import { Button } from "@/components/ui/button";
import useInstallPWA from "@/hooks/useInstallPWA";
import useServiceWorkerRegist from "@/hooks/useServiceWorkerRegist";

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
      <Button onClick={requestPushPermission}>푸시 알림 허용</Button>
      <SearchBar />
      <SubwayState />
    </div>
  );
}
