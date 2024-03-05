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
  // 이수역에서 에러 발생, 여러 호선이 동시에 존재하는 경우 뭔가 다른가? 총신대입구(이수) 이렇게 나와서 에러가 나오네...
  // 검색결과가 없을 경우도 필터링 해야함.
  console.log("searchResult", searchResult);
  if (
    ("status" in searchResult &&
      (searchResult.status < 200 || searchResult.status >= 300)) ||
    !("realtimeArrivalList" in searchResult) ||
    searchResult.realtimeArrivalList.length <= 0
  ) {
    // 에러 메시지가 있는 경우 또는 realtimeArrivalList가 없거나 비어 있는 경우
    const errorMessage =
      "status" in searchResult ? searchResult.message : "데이터가 업슴다.";
    return <div>{errorMessage}</div>;
  }

  const subwayId = searchResult.realtimeArrivalList[0].subwayId;
  const stationName = searchResult.realtimeArrivalList[0].statnNm;
  const hosun = subwayInfo[subwayId];
  // 1개 이상의 데이터가 넘어오는데, 현재 역은 모두 공통이다. 상행, 하행 구분도 해야 함

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
  console.log("상행", upLine);
  console.log("하행", downLine);

  return (
    <div className="flex flex-col gap-16">
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
