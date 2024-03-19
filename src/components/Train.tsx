import useSearchByWebsocket from "@/hooks/useSearchByWebSocket";
import useSearchWordStore from "@/stores/searchWord";
import useTrackSubwayStore from "@/stores/trackSubway";
import useUserInfoStore from "@/stores/userInfo";
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

interface TrainProps {
  trainInfo: realTimeArrivalListType;
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

const Train = ({ trainInfo }: TrainProps) => {
  const { subwayId, btrainNo } = trainInfo;
  const { sendTrackSubwayInfo } = useSearchByWebsocket();
  const searchWord = useSearchWordStore((state) => state.searchWord);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const setSubwayNumber = useTrackSubwayStore((state) => state.setSubwayNumber);
  const selectedSubway = useTrackSubwayStore((state) => state.subwayNumber);

  const onClickHandler = () => {
    setSubwayNumber(btrainNo);
    sendTrackSubwayInfo({
      type: "subway",
      subwayNumber: btrainNo,
      userId: userInfo.id,
      searchWord: searchWord,
    });
  };

  return (
    <div
      className={`flex min-w-[200px] flex-col gap-4 border border-${subwayId} border-opacity-25 border shadow-lg p-2 rounded-md ${
        selectedSubway === btrainNo ? `bg-${subwayId}` : ""
      }`}
      onClick={() => {}}
    >
      <div className="flex gap-2">
        <span>{trainInfo.trainLineNm.split("-")[0]}</span>
        <span>({trainInfo.btrainSttus})</span>
      </div>
      <div className="flex gap-2">
        <span>{trainInfo.arvlMsg3}</span>
        <span>[{arrivalCode[trainInfo.arvlCd]}]</span>
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

export default Train;
