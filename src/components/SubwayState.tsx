import useSearchResultStore from "@/stores/searchResult";
import info from "../subway_info.json";
import type { realTimeArrivalListType } from "../types/ResponseType";

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

const SubwayState = () => {
  const searchResult = useSearchResultStore((state) => state.searchResult);

  if (
    ("status" in searchResult &&
      (searchResult.status < 200 || searchResult.status >= 300)) ||
    !("realtimeArrivalList" in searchResult) ||
    searchResult.realtimeArrivalList.length <= 0
  ) {
    const errorMessage =
      "status" in searchResult ? searchResult.message : "데이터가 업슴다.";
    return <div>{errorMessage}</div>;
  }

  // NOTE 환승 역 갯수
  const transferCount = searchResult.realtimeArrivalList[0].trnsitCo;
  console.log("transferCount", transferCount);
  // NOTE 환승 역 ID List
  const subwayIdListString = searchResult.realtimeArrivalList[0].subwayList;
  const subwayIdList = subwayIdListString.split(",");
  console.log("subwayIdList", subwayIdList);

  const subwayObject = subwayIdList.reduce<{
    [key: string]: realTimeArrivalListType[];
  }>((acc, cur) => {
    acc[cur] = []; // 어차피 들어올거니까 타입 단언으로 막아버림
    return acc;
  }, {});

  searchResult.realtimeArrivalList.forEach((list) => {
    subwayObject[list.subwayId].push(list);
  });

  console.log("subwayObject", subwayObject);

  const subwayId = searchResult.realtimeArrivalList[0].subwayId;
  const stationName = searchResult.realtimeArrivalList[0].statnNm;
  const hosun = subwayInfo[subwayId];

  const { upLine, downLine } = searchResult.realtimeArrivalList.reduce<{
    upLine: realTimeArrivalListType[];
    downLine: realTimeArrivalListType[];
  }>(
    (acc, result) => {
      if (result.updnLine === "상행") {
        acc.upLine.push(result);
      } else {
        acc.downLine.push(result);
      }
      return acc;
    },
    { upLine: [], downLine: [] }
  );

  return (
    <div className="flex flex-col gap-16">
      <span>상행</span>
      <div
        id="upline"
        className="flex min-w-[680px] m-auto justify-center items-center"
      >
        <div
          className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center`}
        >
          {hosun.station[upLine[0].statnFid]}
        </div>
        <div
          className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-${subwayId} `}
        >
          {stationName}
        </div>
        <div
          className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center `}
        >
          {hosun.station[upLine[0].statnTid]}
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
          {hosun.station[downLine[0].statnFid]}
        </div>
        <div
          className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-${subwayId} `}
        >
          {stationName}
        </div>
        <div
          className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center `}
        >
          {hosun.station[downLine[0].statnTid]}
        </div>
      </div>
    </div>
  );
};

export default SubwayState;
