import { realTimeArrivalListType } from "@/types/ResponseType";
import info from "../subway_info.json";

interface LineStateProps {
  lineList: realTimeArrivalListType[];
}

interface SubwayInfoType {
  [key: string]: {
    name: string;
    color: string;
    station: {
      [key: string]: string;
    };
  };
}

const subwayInfo: SubwayInfoType = info;

const LineState = ({ lineList }: LineStateProps) => {
  const subwayId = lineList[0].subwayId;
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

  const up_prevStation = subwayJson.station[upLine[0].statnFid];
  const up_nextStation = subwayJson.station[upLine[0].statnTid];
  const down_prevStation = subwayJson.station[downLine[0].statnFid];
  const down_nextStation = subwayJson.station[downLine[0].statnTid];

  return (
    <>
      <span>상행</span>
      <div
        id="upline"
        className="flex min-w-[680px] m-auto justify-center items-center"
      >
        <div
          className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center`}
        >
          {up_prevStation}
        </div>
        <div
          className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-${subwayId} `}
        >
          {stationName}
        </div>
        <div
          className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center `}
        >
          {up_nextStation}
        </div>
      </div>
      <span>하행</span>
      <div
        id="downline"
        className="flex min-w-[680px] m-auto justify-center items-center"
      >
        <div
          className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center`}
        >
          {down_prevStation}
        </div>
        <div
          className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-${subwayId} `}
        >
          {stationName}
        </div>
        <div
          className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center `}
        >
          {down_nextStation}
        </div>
      </div>
    </>
  );
};

export default LineState;
