import { realTimeArrivalListType } from "@/types/ResponseType";
import { TbTrain } from "react-icons/tb";
import info from "../subway_info.json";
import Train from "./Train";
interface LineStateProps {
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

  const prevStation: string[] = stationKeys
    .slice(Math.max(0, stationIndex - 3), stationIndex)
    .map((stKey) => subwayJson.station[stKey]);
  prevStation.push(subwayJson.station[stationId]);

  const nextStation: string[] = stationKeys
    .slice(stationIndex + 1, stationIndex + 4)
    .map((stKey) => subwayJson.station[stKey])
    .reverse();
  nextStation.push(subwayJson.station[stationId]);

  return { prevStation, nextStation };
};

const LineState = ({ lineList }: LineStateProps) => {
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

  const { prevStation, nextStation } = prevNextStation(subwayJson, stationId);

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
      <div
        id="upline"
        className="flex flex-col max-w-[390px] w-full m-auto justify-center items-center gap-4"
      >
        <span className="text-2xl text-white">{upText}</span>
        <div className="flex justify-center items-center text-white">
          <div
            className={`bg-${subwayId} w-[110px] h-12 flex justify-center items-center text-sm`}
          >
            <span className="text-wrap">{up_prevStation}</span>
          </div>
          <div
            className={`border w-[180px] h-[180px] rounded-[50%] flex justify-center items-center bg-${subwayId} text-3xl `}
          >
            <span>{stationName}</span>
          </div>
          <div
            className={`bg-${subwayId} w-[110px] h-12 flex justify-center items-center text-sm `}
          >
            <span>{up_nextStation}</span>
          </div>
        </div>
        <div className="flex overflow-auto items-start gap-4 w-full">
          {sortedUpLine.map((line) => {
            console.log("line", line);
            return (
              <Train
                key={Number(line.btrainNo) * Math.random()}
                trainInfo={line}
              />
            );
          })}
        </div>
        <div className="w-full flex justify-between relative mt-10">
          <div className={`border-b-2 w-full absolute border-${subwayId}`} />
          {nextStation.map((station, i) => (
            <div className="relative p-2 w-1/4 flex justify-center" key={i}>
              {sortedUpLine.map((line) =>
                line.arvlMsg3 === station ? (
                  <TbTrain
                    className="absolute top-[-20px] left-[37px]"
                    key={Number(line.btrainNo) * Math.random()}
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
      <div
        id="downline"
        className="flex flex-col max-w-[390px] w-full m-auto justify-center items-center gap-4"
      >
        <span className="text-2xl text-white">{downText}</span>
        <div className="flex justify-center items-center text-white">
          <div
            className={`bg-${subwayId} w-[110px] h-12 flex justify-center items-center text-sm`}
          >
            {down_prevStation}
          </div>
          <div
            className={`border w-[180px] h-[180px] rounded-[50%] flex justify-center items-center bg-${subwayId} text-3xl `}
          >
            {stationName}
          </div>
          <div
            className={`bg-${subwayId} w-[110px] h-12 flex justify-center items-center text-sm `}
          >
            {down_nextStation}
          </div>
        </div>
        <div className="flex overflow-auto items-start gap-4 w-full">
          {sortedDownLine.map((line) => {
            return <Train key={Math.random()} trainInfo={line} />;
          })}
        </div>
        <div className="w-full flex justify-between relative mt-10">
          <div className={`border-b-2 w-full absolute border-${subwayId}`} />
          {prevStation.map((station) => (
            <div
              className="relative p-2 w-1/4 flex justify-center"
              key={Math.random()}
            >
              {sortedDownLine.map((line) =>
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
    </div>
  );
};

export default LineState;
