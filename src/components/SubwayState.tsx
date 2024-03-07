import useSearchResultStore from "@/stores/searchResult";
import type { realTimeArrivalListType } from "../types/ResponseType";
import LineState from "./LineState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
    acc[cur] = [];
    return acc;
  }, {});

  searchResult.realtimeArrivalList.forEach((list) => {
    subwayObject[list.subwayId].push(list);
  });

  console.log("subwayObject", subwayObject);

  // TODO 여기서 Tabs으로 구분해야 할 듯??
  // TabList가 될 것 들은 subwayIdList를 사용해서 만들어야 할 것 같음

  return (
    <Tabs defaultValue={subwayIdList[0]}>
      <TabsList>
        {subwayIdList.map((list) => (
          <TabsTrigger value={list}>{list}</TabsTrigger>
        ))}
      </TabsList>
      {subwayIdList.map((list) => (
        <TabsContent value={list}>
          <LineState lineList={subwayObject[list]} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default SubwayState;
