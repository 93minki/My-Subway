/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import SubwayLineTabs from "@/components/SubwayLineTabs";
import { Button } from "@/components/ui/button";
import useInstallPWA from "@/hooks/useInstallPWA";
import useServiceWorkerRegist from "@/hooks/useServiceWorkerRegist";
import { Bell, Download } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div
        id="home"
        className="flex flex-col gap-8 max-w-md w-full mx-auto pt-4 pb-8"
      >
        {/* PWA 설치 및 알림 허용 */}
        <div className="flex flex-col gap-3 px-4">
          {isInstallable && (
            <Button
              onClick={showInstallPrompt}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-medium shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              앱으로 설치하기
            </Button>
          )}

          <div className="flex flex-col justify-center">
            {Notification.permission !== "granted" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                {(isSafari || isMobileSafari || isIOS) && (
                  <p className="text-xs text-amber-700 mb-2 text-center">
                    iOS는 반드시 알림 허용 버튼을 눌러야 합니다.
                  </p>
                )}
                <Button
                  onClick={requestPushPermission}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3 font-medium"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  푸시 알림 허용
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 검색 영역 */}
        <div className="flex flex-col gap-4">
          <SearchBar />
          <SearchHistory />
        </div>

        {/* 지하철 정보 */}
        <SubwayLineTabs />
      </div>
    </div>
  );
}
