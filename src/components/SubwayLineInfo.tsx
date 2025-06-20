import useSubwayLineInfo from "@/hooks/useSubwayLineInfo";
import { realTimeArrivalListType } from "@/types/ResponseType";
import info from "../subway_info.json";
import SubwayLineDirection from "./SubwayLineDirection";

interface SubwayLineInfoProps {
  lineList: realTimeArrivalListType[];
}

interface SubwayAllInfoType {
  [key: string]: {
    name: string;
    color: string;
    station: {
      [key: string]: string;
    };
  };
}

const subwayInfo: SubwayAllInfoType = info;

const SubwayLineInfo = ({ lineList }: SubwayLineInfoProps) => {
  const subwayId = lineList[0].subwayId;
  const stationId = lineList[0].statnId;
  const subwayJson = subwayInfo[subwayId];
  const stationName = lineList[0].statnNm;

  // 상행, 하행 구분하는 것은 도메인(비즈니스)로직이 될 수 없음.
  const { upLine, downLine } = lineList.reduce<{
    upLine: realTimeArrivalListType[];
    downLine: realTimeArrivalListType[];
  }>(
    (acc, result) => {
      if (result.updnLine === "상행" || result.updnLine === "내선") {
        acc.upLine.push(result);
      } else {
        acc.downLine.push(result);
      }
      return acc;
    },
    { upLine: [], downLine: [] }
  );

  const upText = upLine[0].updnLine;
  const up_prevStation = subwayJson.station[upLine[0].statnFid];
  const up_nextStation = subwayJson.station[upLine[0].statnTid];
  const downText = downLine[0].updnLine;
  const down_prevStation = subwayJson.station[downLine[0].statnFid];
  const down_nextStation = subwayJson.station[downLine[0].statnTid];

  const { upDownLineList, sortLine } = useSubwayLineInfo();

  const { downLineStations, upLineStations } = upDownLineList(
    subwayJson,
    stationId
  );
  const sortedUpLine = sortLine(upLine);
  const sortedDownLine = sortLine(downLine);

  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* 역 정보 헤더 */}
      <div className="text-center py-4 px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className={`w-4 h-4 rounded-full bg-${subwayId}`} />
          <h2 className="text-2xl font-bold text-gray-800">{stationName}역</h2>
          <div className={`w-4 h-4 rounded-full bg-${subwayId}`} />
        </div>
        <p className="text-sm text-gray-600">
          {subwayJson.name} 실시간 도착 정보
        </p>
      </div>

      {/* 상행선 */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mx-4">
        <SubwayLineDirection
          direction={upText}
          subwayId={subwayId}
          prevStation={up_prevStation}
          stationList={upLineStations}
          nextStation={up_nextStation}
          stationName={stationName}
          sortedLine={sortedUpLine}
        />
      </div>

      {/* 하행선 */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mx-4">
        <SubwayLineDirection
          direction={downText}
          subwayId={subwayId}
          prevStation={down_prevStation}
          stationList={downLineStations}
          nextStation={down_nextStation}
          stationName={stationName}
          sortedLine={sortedDownLine}
        />
      </div>
    </div>
  );
};

export default SubwayLineInfo;
