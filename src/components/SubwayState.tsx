import info from "../subway_info.json";

interface SubwayStateProps {
  subwayId: string; // 호선 1007 -> 7호선 1006 -> 6호선 ,, 다른것도 있음.
  statnFid: string; // 이전 지하철역 ID
  statnTid: string; // 다음 지하철역 ID
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

const SubwayState = ({
  subwayId = "1007",
  statnFid = "1007000738",
  statnTid = "1007000736",
}: SubwayStateProps) => {
  const colorCode = subwayInfo[subwayId].color;
  console.log("colorCode", colorCode);
  const prevStation = subwayInfo[subwayId].station[statnFid];
  const nextStation = subwayInfo[subwayId].station[statnTid];

  console.log("이전역", prevStation);
  console.log("다음역", nextStation);

  return (
    <div className="flex min-w-[680px] m-auto justify-center items-center">
      <div
        className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center`}
      >
        prev
      </div>
      <div
        className={`border w-[200px] h-[200px] rounded-[50%] flex justify-center items-center bg-${subwayId} `}
      >
        current
      </div>
      <div
        className={`bg-${subwayId} w-[100px] h-12 flex justify-center items-center `}
      >
        next
      </div>
    </div>
  );
};

export default SubwayState;
