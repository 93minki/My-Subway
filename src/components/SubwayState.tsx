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
  if (searchResult.realtimeArrivalList.length <= 0) {
    return <div>데이터가 업슴다.</div>;
  }

  const subwayId = searchResult.realtimeArrivalList[0].subwayId;
  const colorCode = subwayInfo[subwayId].color;
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
          className={`bg-${colorCode} w-[100px] h-12 flex justify-center items-center`}
        >
          prev
        </div>
        <div
          className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-${colorCode} `}
        >
          current
        </div>
        <div
          className={`bg-${colorCode} w-[100px] h-12 flex justify-center items-center `}
        >
          next
        </div>
      </div>
      <div
        id="downline"
        className="flex min-w-[680px] m-auto justify-center items-center"
      >
        <div
          className={`bg-${colorCode} w-[100px] h-12 flex justify-center items-center`}
        >
          prev
        </div>
        <div
          className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-${colorCode} `}
        >
          current
        </div>
        <div
          className={`bg-${colorCode} w-[100px] h-12 flex justify-center items-center `}
        >
          next
        </div>
      </div>
    </div>
  );
};

export default SubwayState;
