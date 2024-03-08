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
      className={`flex flex-col gap-4 border border-${subwayId} border-opacity-25 w-[300px] border shadow-lg p-2 rounded-md`}
    >
      <span>{trainInfo.trainLineNm}</span>
      <span>도착 메세지: {trainInfo.arvlMsg3}</span>
      <span>도착 메세지: {trainInfo.arvlMsg2}</span>
      <span>코드: {arrivalCode[trainInfo.arvlCd]}</span>
      <span>도착 예정 시간: {trainInfo.barvlDt} sec</span>
    </div>
  );
};

export default Train;
