import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Home, Plus, Share } from "lucide-react";

interface IOSInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IOSInstallGuide({
  isOpen,
  onClose,
}: IOSInstallGuideProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">📱 앱으로 설치하기</DialogTitle>
          <DialogDescription className="text-center">
            iOS에서 웹푸시 알림을 받으려면
            <br />
            반드시 홈 화면에 추가해야 합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Step 1 */}
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Share className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">공유 버튼 누르기</span>
              </div>
              <p className="text-xs text-gray-600">
                Safari 브라우저 하단의 공유 버튼을 눌러주세요
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Plus className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">
                  "홈 화면에 추가" 선택
                </span>
              </div>
              <p className="text-xs text-gray-600">
                메뉴에서 "홈 화면에 추가" 옵션을 찾아 선택하세요
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Home className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">홈 화면에서 실행</span>
              </div>
              <p className="text-xs text-gray-600">
                설치 후 홈 화면의 앱 아이콘으로 실행하면 알림을 받을 수 있습니다
              </p>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-amber-800 mb-2">
              ⚠️ 중요한 안내
            </h4>
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• iOS는 브라우저에서 웹푸시 알림을 지원하지 않습니다</li>
              <li>• 반드시 홈 화면에 추가 후 앱으로 실행해야 합니다</li>
              <li>• Chrome 또는 다른 브라우저에서는 작동하지 않습니다</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            확인했습니다
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
