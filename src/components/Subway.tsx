import useSubway from "@/hooks/useSubway";
import { realTimeArrivalListType } from "@/types/ResponseType";
import { Bell, Plus, Train, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface SubwayProps {
  subwayInfo: realTimeArrivalListType;
}

const arrivalCode: { [key: string]: string } = {
  0: "진입",
  1: "도착",
  2: "출발",
  3: "전역출발",
  4: "전역진입",
  5: "전역도착",
  99: "운행중",
};

// 추적 요청, 추적 중단 요청

const Subway = ({ subwayInfo }: SubwayProps) => {
  const { onClickHandler, isSubwaySelected } = useSubway(subwayInfo);

  const getStatusColor = (code: string) => {
    switch (code) {
      case "0":
      case "1":
        return "text-red-600 bg-red-50";
      case "2":
        return "text-blue-600 bg-blue-50";
      case "3":
      case "4":
      case "5":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div
      className={`
        relative min-w-[200px] w-full max-w-[240px] p-4 rounded-2xl shadow-lg transition-all duration-300
        ${
          isSubwaySelected
            ? "text-white shadow-xl"
            : "bg-white border border-gray-200 hover:shadow-xl hover:border-gray-300"
        }
      `}
      style={
        isSubwaySelected
          ? {
              background: `linear-gradient(to bottom right, var(--${subwayInfo.subwayId}), var(--${subwayInfo.subwayId}))`,
            }
          : {}
      }
    >
      {/* 추적 중 표시 */}
      {isSubwaySelected && (
        <div className="absolute -top-0 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
          <Bell className="w-4 h-4" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* 열차 정보 */}
        <div className="flex items-center gap-2">
          <Train
            className={`w-5 h-5 ${isSubwaySelected ? "text-white" : `text-${subwayInfo.subwayId}`}`}
          />
          <div className="flex flex-col">
            <span
              className={`font-semibold text-sm ${isSubwaySelected ? "text-white" : "text-gray-800"}`}
            >
              {subwayInfo.trainLineNm.split("-")[0]}
            </span>
            <span
              className={`text-xs ${isSubwaySelected ? "text-blue-100" : "text-gray-500"}`}
            >
              ({subwayInfo.btrainSttus})
            </span>
          </div>
        </div>

        {/* 위치 및 상태 */}
        <div className="flex flex-col gap-2">
          <div
            className={`text-sm font-medium ${isSubwaySelected ? "text-white" : "text-gray-800"}`}
          >
            현재 위치: {subwayInfo.arvlMsg3}
          </div>
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
              isSubwaySelected
                ? "bg-white/20 text-white"
                : getStatusColor(subwayInfo.arvlCd)
            }`}
          >
            {arrivalCode[subwayInfo.arvlCd]}
          </div>
        </div>

        {/* 등록/중단 버튼 */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={`
                w-full rounded-xl font-medium transition-all duration-200
                ${
                  isSubwaySelected
                    ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    : `bg-${subwayInfo.subwayId} hover:bg-${subwayInfo.subwayId}/90 text-white`
                }
              `}
            >
              {isSubwaySelected ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  추적 중단
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  추적 등록
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto rounded-3xl">
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl">
                {isSubwaySelected
                  ? "지하철 추적을 중단하시겠습니까?"
                  : "지하철 추적을 등록하시겠습니까?"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {isSubwaySelected
                  ? "현재 추적 중인 지하철의 실시간 알림이 중단됩니다."
                  : "설정한 지하철의 현재 위치를 실시간 알림으로 확인할 수 있습니다."}
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={() => onClickHandler({ isSelected: isSubwaySelected })}
                className={`w-full rounded-xl py-3 font-medium ${
                  isSubwaySelected
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isSubwaySelected ? "추적 중단" : "추적 등록"}
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Subway;
