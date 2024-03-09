import { realTimeArrivalListType } from "@/types/ResponseType";

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

const Train = ({ trainInfo }: TrainProps) => {
  const { subwayId } = trainInfo;
  return (
    <div
      className={`flex min-w-[200px] flex-col gap-4 border border-${subwayId} border-opacity-25 border shadow-lg p-2 rounded-md`}
    >
      <div className="flex gap-2">
        <span>{trainInfo.trainLineNm.split("-")[0]}</span>
        <span>({trainInfo.btrainSttus})</span>
      </div>
      <div className="flex gap-2">
        <span>{trainInfo.arvlMsg3}</span>
        <span>[{arrivalCode[trainInfo.arvlCd]}]</span>
      </div>
    </div>
  );
};

export default Train;
