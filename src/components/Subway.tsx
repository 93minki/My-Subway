import useSubway from "@/hooks/useSubway";
import { realTimeArrivalListType } from "@/types/ResponseType";
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

// API 필요 클릭했을 때 구독 요청을 보내야 함

const Subway = ({ subwayInfo }: SubwayProps) => {
  const { onClickHandler, isSubwaySelected } = useSubway(subwayInfo);

  return (
    <div
      className={`flex min-w-[200px] flex-col gap-4 border border-${
        subwayInfo.subwayId
      } border-opacity-25 border shadow-lg p-2 rounded-md ${
        isSubwaySelected ? `bg-${subwayInfo.subwayId}` : ""
      }`}
    >
      <div className="flex gap-2">
        <span>{subwayInfo.trainLineNm.split("-")[0]}</span>
        <span>({subwayInfo.btrainSttus})</span>
      </div>
      <div className="flex gap-2">
        <span>{subwayInfo.arvlMsg3}</span>
        <span>[{arrivalCode[subwayInfo.arvlCd]}]</span>
      </div>
      <Dialog>
        <DialogTrigger>등록하기</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>지하철 알림을 등록하시겠습니까</DialogTitle>
            <DialogDescription>
              설정한 지하철의 현재 위치를 실시간 알림으로 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button type="button" onClick={onClickHandler}>
              등록하기
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subway;
