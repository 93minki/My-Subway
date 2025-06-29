/* eslint-disable @typescript-eslint/no-explicit-any */
import LogoutButton from "@/components/auth/LogoutButton";
import IOSInstallGuide from "@/components/IOSInstallGuide";
import SearchBar from "@/components/SearchBar";
import SearchHistory from "@/components/SearchHistory";
import SubwayLineTabs from "@/components/SubwayLineTabs";
import { Button } from "@/components/ui/button";
import useInstallPWA from "@/hooks/useInstallPWA";
import useNotificationPermission from "@/hooks/useNotificationPermission";
import useServiceWorkerRegist from "@/hooks/useServiceWorkerRegist";
import useTrackSubwayStore from "@/stores/trackSubway";
import useUserInfoStore from "@/stores/userInfo";
import { Bell, Download, User } from "lucide-react";
import { useState } from "react";
import { isIOS, isMobileSafari, isSafari } from "react-device-detect";

export default function Home() {
  const { isInstallable, showInstallPrompt } = useInstallPWA();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const subwayNumber = useTrackSubwayStore((state) => state.subwayNumber);

  // 실시간 알림 권한 상태 훅 사용
  const {
    isSupported: isNotificationSupported,
    isGranted: isPermissionGranted,
    requestPermission,
  } = useNotificationPermission();

  useServiceWorkerRegist();

  // iOS 여부 체크 (PWA 설치 가이드용)
  const isIOSDevice = isIOS || isMobileSafari || isSafari;

  // PWA 설치 가능 여부를 정확하게 확인
  const getPWAInstallability = () => {
    // 먼저 이미 PWA로 실행 중인지 확인 (iOS, Android 공통)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;

    // PWA로 이미 실행 중이면 설치 안내 표시하지 않음
    if (isStandalone || isInWebAppiOS) {
      return { canInstall: false, type: "already-installed" };
    }

    // iOS의 경우 PWA로 실행 중이 아니면 수동 설치 가이드 제공
    if (isIOSDevice) {
      return { canInstall: true, type: "ios-manual" };
    }

    // 안드로이드/데스크톱: 브라우저 자동 설치 프롬프트가 있는 경우
    if (isInstallable) {
      return { canInstall: true, type: "browser-prompt" };
    }

    // PWA 기본 요구사항 확인 (안드로이드/데스크톱)
    const hasServiceWorker = "serviceWorker" in navigator;
    const isSecure =
      location.protocol === "https:" || location.hostname === "localhost";
    const hasManifest = !!document.querySelector('link[rel="manifest"]');
    const isChromeBased = /Chrome|Chromium|Edge|Samsung/.test(
      navigator.userAgent
    );

    // 기본 요구사항을 만족하는 경우에만 수동 설치 안내 제공
    if (hasServiceWorker && isSecure && hasManifest && isChromeBased) {
      return { canInstall: true, type: "manual-guide" };
    }

    // 설치 불가능
    return { canInstall: false, type: "not-supported" };
  };

  // iOS용 PWA 설치 가이드 모달 열기
  const showIOSInstallGuide = () => {
    setShowIOSGuide(true);
  };

  const installability = getPWAInstallability();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div
        id="home"
        className="flex flex-col gap-8 max-w-md w-full mx-auto pt-4 pb-8"
      >
        {/* 사용자 헤더 영역 */}
        <div
          className={`relative ${
            subwayNumber
              ? "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-[2px] rounded-2xl shadow-lg"
              : ""
          }`}
        >
          <div
            className={`flex items-center justify-between px-4 py-3 bg-white rounded-2xl ${
              subwayNumber ? "rounded-2xl" : "shadow-sm border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                {/* 추적 중일 때 표시기 - 더 크게 */}
                {subwayNumber && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md animate-pulse" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 text-sm">
                  {userInfo.nickname}
                </span>
                <span className="text-xs text-gray-500">{userInfo.email}</span>
                {/* 추적 상태 표시 */}
                {subwayNumber && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">
                      추적중인 지하철이 있습니다.
                    </span>
                  </div>
                )}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* PWA 설치 및 알림 허용 */}
        <div className="flex flex-col gap-3 px-4">
          {/* iOS - PWA 설치 가이드 (PWA로 실행 중이 아닐 때만) */}
          {installability.canInstall &&
            installability.type === "ios-manual" && (
              <Button
                onClick={showIOSInstallGuide}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                앱으로 설치하기 (iOS)
              </Button>
            )}

          {/* 안드로이드 - 브라우저 자동 설치 프롬프트가 있는 경우 */}
          {installability.canInstall &&
            installability.type === "browser-prompt" && (
              <Button
                onClick={showInstallPrompt}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-medium shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                앱으로 설치하기
              </Button>
            )}

          {/* 안드로이드 - 수동 설치 안내 (자동 프롬프트가 없는 경우) */}
          {installability.canInstall &&
            installability.type === "manual-guide" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    앱으로 설치하기
                  </span>
                </div>
                <p className="text-xs text-blue-700 mb-3">
                  브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치"를 선택하세요
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <div>
                    • Chrome: 주소창 오른쪽 설치 아이콘 또는 메뉴 → "앱 설치"
                  </div>
                  <div>• Edge: 메뉴 (⋯) → "앱" → "이 사이트를 앱으로 설치"</div>
                  <div>• Samsung Internet: 메뉴 → "페이지 추가"</div>
                </div>
              </div>
            )}

          {/* 알림 허용 - 필요한 경우에만 표시 */}
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
