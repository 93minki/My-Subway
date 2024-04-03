import { realTimeArrivalListType } from "@/types/ResponseType";
import info from "../subway_info.json";
import SubwayLineDirection from "./SubwayLineDirection";
interface SubwayLineInfoProps {
  lineList: realTimeArrivalListType[];
}

interface SubwayAllInfoType {
  [key: string]: SubwayInfoType;
}
interface SubwayInfoType {
  name: string;
  color: string;
  station: {
    [key: string]: string;
  };
}

const subwayInfo: SubwayAllInfoType = info;

const prevNextStation = (subwayJson: SubwayInfoType, stationId: string) => {
  const stationKeys = Object.keys(subwayJson.station);
  const stationIndex = stationKeys.indexOf(stationId);

  const prevStationList: string[] = stationKeys
    .slice(Math.max(0, stationIndex - 3), stationIndex)
    .map((stKey) => subwayJson.station[stKey]);
  prevStationList.push(subwayJson.station[stationId]);

  const nextStationList: string[] = stationKeys
    .slice(stationIndex + 1, stationIndex + 4)
    .map((stKey) => subwayJson.station[stKey])
    .reverse();
  nextStationList.push(subwayJson.station[stationId]);

  return { prevStationList, nextStationList };
};

const SubwayLineInfo = ({ lineList }: SubwayLineInfoProps) => {
  const subwayId = lineList[0].subwayId;
  const stationId = lineList[0].statnId;
  const subwayJson = subwayInfo[subwayId];
  const stationName = lineList[0].statnNm;

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

  const { prevStationList, nextStationList } = prevNextStation(
    subwayJson,
    stationId
  );

  const sortedUpLine = upLine.sort((a, b) => {
    const compare = Number(a.ordkey.slice(2, 5)) - Number(b.ordkey.slice(2, 5));
    if (compare === 0) {
      return Number(a.ordkey[1]) - Number(b.ordkey[1]);
    }
    return compare;
  });
  const sortedDownLine = downLine.sort((a, b) => {
    const compare = Number(a.ordkey.slice(2, 5)) - Number(b.ordkey.slice(2, 5));
    if (compare === 0) {
      return Number(a.ordkey[1]) - Number(b.ordkey[1]);
    }
    return compare;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* up */}
      <SubwayLineDirection
        direction={upText}
        subwayId={subwayId}
        prevStation={up_prevStation}
        nextStationList={nextStationList}
        nextStation={up_nextStation}
        stationName={stationName}
        sortedLine={sortedUpLine}
      />
      {/* down */}
      <SubwayLineDirection
        direction={downText}
        subwayId={subwayId}
        prevStation={down_prevStation}
        nextStationList={prevStationList}
        nextStation={down_nextStation}
        stationName={stationName}
        sortedLine={sortedDownLine}
      />
    </div>
  );
};

export default SubwayLineInfo;
