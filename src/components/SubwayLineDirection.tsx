import { realTimeArrivalListType } from "@/types/ResponseType";
import { MapPin, Train } from "lucide-react";
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
    <div className="flex flex-col w-full justify-center items-center gap-6 px-4">
      {/* 방향 표시 */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full bg-${subwayId}`}></div>
        <span className="text-xl font-bold text-gray-800">{direction}</span>
      </div>

      {/* 중앙 역 표시 - 이전 버전으로 복원 */}
      <div className="flex justify-center items-center text-white relative">
        <div
          className={`bg-${subwayId} w-24 h-12 flex justify-center items-center text-sm font-medium rounded-l-xl shadow-md`}
        >
          <span className="truncate px-2">{prevStation}</span>
        </div>
        <div
          className={`border-4 border-white w-36 h-36 rounded-full flex justify-center items-center bg-${subwayId} text-2xl font-bold shadow-lg relative z-10`}
        >
          <div className="text-center">
            <MapPin className="w-6 h-6 mx-auto mb-1" />
            <span className="block text-base leading-tight">{stationName}</span>
          </div>
        </div>
        <div
          className={`bg-${subwayId} w-24 h-12 flex justify-center items-center text-sm font-medium rounded-r-xl shadow-md`}
        >
          <span className="truncate px-2">{nextStation}</span>
        </div>
      </div>

      {/* 운행 중인 열차 목록 */}
      {sortedLine.length > 0 && (
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            운행 중인 열차
          </h3>
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {sortedLine.map((line) => (
              <div key={Math.random()} className="flex-shrink-0">
                <Subway subwayInfo={line} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 하단 역 표시 - 통합된 디자인 */}
      <div className="w-full relative mt-6 px-4 pb-8">
        {/* 노선 */}
        <div className={`h-1 w-full bg-${subwayId} rounded-full relative`}>
          {stationList.map((station, index) => {
            const hasTrainAtStation = sortedLine.some(
              (line) => line.arvlMsg3 === station
            );

            return (
              <div
                key={`station-${station}-${index}`}
                className="absolute"
                style={{
                  left: `${(index / (stationList.length - 1)) * 100}%`,
                  transform: "translateX(-50%)",
                  top: "50%",
                }}
              >
                {/* 지하철 아이콘 - 가장 위에 */}
                {hasTrainAtStation && (
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                    <Train
                      className={`w-5 h-5 text-${subwayId} animate-pulse`}
                    />
                  </div>
                )}

                {/* 역 이름 - 원 위에 */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <span
                    className={`text-xs font-medium text-center whitespace-nowrap px-1 py-0.5 rounded ${
                      station === stationName
                        ? `text-white bg-${subwayId} font-bold`
                        : "text-gray-700 bg-white/80"
                    } shadow-sm`}
                  >
                    {station}
                  </span>
                </div>

                {/* 역 표시점 (원) */}
                <div
                  className={`w-4 h-4 bg-white border-2 border-${subwayId} rounded-full shadow-sm transform -translate-y-1/2`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubwayLineDirection;
