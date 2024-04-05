import { realTimeArrivalListType } from "@/types/ResponseType";
import { TbTrain } from "react-icons/tb";
import Subway from "./Subway";

interface SubwayLineDirectionProps {
  direction: string;
  subwayId: string;
  prevStation: string;
  stationName: string;
  stationList: string[];
  nextStation: string;
  sortedLine: realTimeArrivalListType[];
}

const SubwayLineDirection = ({
  direction,
  subwayId,
  prevStation,
  stationName,
  stationList,
  nextStation,
  sortedLine,
}: SubwayLineDirectionProps) => {
  return (
    <div className="flex flex-col max-w-[390px] w-full m-auto justify-center items-center gap-4">
      <span className="text-2xl ">{direction}</span>
      <div className="flex justify-center items-center text-white">
        <div
          className={`bg-${subwayId} w-[110px] h-12 flex justify-center items-center text-sm`}
        >
          {prevStation}
        </div>
        <div
          className={`border w-[180px] h-[180px] rounded-[50%] flex justify-center items-center bg-${subwayId} text-3xl `}
        >
          {stationName}
        </div>
        <div
          className={`bg-${subwayId} w-[110px] h-12 flex justify-center items-center text-sm `}
        >
          {nextStation}
        </div>
      </div>
      <div className="flex overflow-auto items-start gap-4 w-full">
        {sortedLine.map((line) => {
          return <Subway key={Math.random()} subwayInfo={line} />;
        })}
      </div>
      <div className="w-full flex justify-between relative mt-10">
        <div className={`border-b-2 w-full absolute border-${subwayId}`} />
        {stationList.map((station) => (
          <div
            className="relative p-2 w-1/4 flex justify-center"
            key={Math.random()}
          >
            {sortedLine.map((line) =>
              line.arvlMsg3 === station ? (
                <TbTrain
                  key={Number(line.btrainNo) * Math.random()}
                  className="absolute top-[-20px] left-[37px]"
                />
              ) : (
                ""
              )
            )}

            <div
              className={`border border-${subwayId} bg-white rounded-lg w-[8px] h-[8px] absolute right-1/2 top-[-3px]`}
            />
            <span className="">{station}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubwayLineDirection;
