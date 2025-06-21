/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import IOSInstallGuide from "@/components/IOSInstallGuide";
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import SubwayLineTabs from "@/components/SubwayLineTabs";
import { Button } from "@/components/ui/button";
import useInstallPWA from "@/hooks/useInstallPWA";
import useNotificationPermission from "@/hooks/useNotificationPermission";
import useServiceWorkerRegist from "@/hooks/useServiceWorkerRegist";
import { Bell, Bug, Download } from "lucide-react";
import { useState } from "react";
import {
  isAndroid,
  isIOS,
  isMobile,
  isMobileSafari,
  isSafari,
} from "react-device-detect";

export default function Home() {
  const { isInstallable, showInstallPrompt, getDebugInfo } = useInstallPWA();
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // 실시간 알림 권한 상태 훅 사용
  const {
    permission,
    isSupported: isNotificationSupported,
    isGranted: isPermissionGranted,
    requestPermission,
  } = useNotificationPermission();

  useServiceWorkerRegist();

  // iOS 여부 체크 (PWA 설치 가이드용)
  const isIOSDevice = isIOS || isMobileSafari || isSafari;

  // 디버깅 정보 (개발 환경에서만)
  const isDevMode = import.meta.env.DEV;
  const pwaDebugInfo = getDebugInfo();
  const debugInfo = {
    isIOSDevice,
    isAndroid,
    isMobile,
    isInstallable,
    isNotificationSupported,
    notificationPermission: permission,
    isPermissionGranted,
    userAgent: navigator.userAgent,
    serviceWorkerSupported: "serviceWorker" in navigator,
    pushManagerSupported: "PushManager" in window,
    pwaStandalone: pwaDebugInfo.isStandalone,
    pwaHasPrompt: pwaDebugInfo.hasPrompt,
    pwaLogs: pwaDebugInfo.logs,
  };

  // iOS용 PWA 설치 가이드 모달 열기
  const showIOSInstallGuide = () => {
    setShowIOSGuide(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div
        id="home"
        className="flex flex-col gap-8 max-w-md w-full mx-auto pt-4 pb-8"
      >
        {/* 디버깅 정보 (개발 환경에서만) */}
        {isDevMode && (
          <div className="px-4">
            <Button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 text-sm"
            >
              <Bug className="w-4 h-4 mr-2" />
              디버깅 정보 {showDebugInfo ? "숨기기" : "보기"}
            </Button>

            {showDebugInfo && (
              <div className="mt-3 p-4 bg-white rounded-xl border text-xs space-y-2 max-h-96 overflow-y-auto">
                <div>
                  <strong>iOS Device:</strong>{" "}
                  {debugInfo.isIOSDevice ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Android:</strong> {debugInfo.isAndroid ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Mobile:</strong> {debugInfo.isMobile ? "Yes" : "No"}
                </div>
                <div>
                  <strong>PWA Installable:</strong>{" "}
                  {debugInfo.isInstallable ? "Yes" : "No"}
                </div>
                <div>
                  <strong>PWA Standalone:</strong>{" "}
                  {debugInfo.pwaStandalone ? "Yes" : "No"}
                </div>
                <div>
                  <strong>PWA Has Prompt:</strong>{" "}
                  {debugInfo.pwaHasPrompt ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Notification Supported:</strong>{" "}
                  {debugInfo.isNotificationSupported ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Notification Permission:</strong>{" "}
                  {debugInfo.notificationPermission}
                </div>
                <div>
                  <strong>Permission Granted:</strong>{" "}
                  {debugInfo.isPermissionGranted ? "Yes" : "No"}
                </div>
                <div>
                  <strong>ServiceWorker:</strong>{" "}
                  {debugInfo.serviceWorkerSupported ? "Yes" : "No"}
                </div>
                <div>
                  <strong>PushManager:</strong>{" "}
                  {debugInfo.pushManagerSupported ? "Yes" : "No"}
                </div>
                <div>
                  <strong>User Agent:</strong>{" "}
                  {debugInfo.userAgent.substring(0, 100)}...
                </div>

                <div className="border-t pt-2 mt-3">
                  <strong>PWA 설치 로그:</strong>
                  <div className="mt-1 space-y-1 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                    {debugInfo.pwaLogs.length > 0 ? (
                      debugInfo.pwaLogs.map((log, index) => (
                        <div key={index} className="text-xs text-gray-700">
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500">
                        로그가 없습니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PWA 설치 및 알림 허용 */}
        <div className="flex flex-col gap-3 px-4">
          {/* iOS - PWA 설치 가이드 */}
          {isIOSDevice && (
            <Button
              onClick={showIOSInstallGuide}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              앱으로 설치하기 (iOS 가이드)
            </Button>
          )}

          {/* 안드로이드 및 기타 - PWA 설치 */}
          {!isIOSDevice && isInstallable && (
            <Button
              onClick={showInstallPrompt}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-medium shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              앱으로 설치하기
            </Button>
          )}

          {/* 안드로이드에서 PWA 설치가 감지되지 않을 때 (개발 환경에서만) */}
          {isDevMode && !isIOSDevice && !isInstallable && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-xs text-orange-700 mb-2 text-center">
                PWA 설치가 감지되지 않았습니다. (개발용)
              </p>
              <Button
                onClick={() => alert("PWA 설치가 지원되지 않는 환경입니다.")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                PWA 설치 (테스트)
              </Button>
            </div>
          )}

          {/* 알림 허용 - 실시간 상태 반영 */}
          <div className="flex flex-col justify-center">
            {isNotificationSupported && !isPermissionGranted && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                {isIOSDevice && (
                  <p className="text-xs text-amber-700 mb-2 text-center">
                    iOS는 PWA로 설치 후 알림 허용이 필요합니다.
                  </p>
                )}
                <Button
                  onClick={requestPermission}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3 font-medium"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  푸시 알림 허용
                </Button>
              </div>
            )}

            {/* 알림이 허용된 상태 */}
            {isNotificationSupported && isPermissionGranted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs text-green-700 mb-2 text-center">
                  ✅ 푸시 알림이 허용되었습니다!
                </p>
                <div className="text-xs text-green-600 text-center">
                  지하철 알림을 받을 수 있습니다.
                </div>
              </div>
            )}

            {/* 개발 환경에서 알림 상태 테스트 버튼 */}
            {isDevMode && isNotificationSupported && (
              <div className="mt-2">
                <Button
                  onClick={requestPermission}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-xl py-2 text-sm"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  알림 상태 테스트 (개발용)
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

      {/* iOS 설치 가이드 모달 */}
      <IOSInstallGuide
        isOpen={showIOSGuide}
        onClose={() => setShowIOSGuide(false)}
      />
    </div>
  );
}
