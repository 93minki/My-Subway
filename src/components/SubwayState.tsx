import useSearchResultStore from "@/stores/searchResult";
import type { realTimeArrivalListType } from "../types/ResponseType";
import LineState from "./LineState";

const SubwayState = () => {
  const searchResult = useSearchResultStore((state) => state.searchResult);
  console.log("searchResult 검색 결과 원본 데이터", searchResult);
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

  // NOTE 환승 역 ID List
  const subwayIdListString = searchResult.realtimeArrivalList[0].subwayList;
  const subwayIdList = subwayIdListString.split(",");
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

  return (
    <div className="flex flex-col gap-16">
      {subwayIdList.map((list) => (
        <LineState key={list} lineList={subwayObject[list]} />
      ))}
    </div>
  );
};

export default SubwayState;
