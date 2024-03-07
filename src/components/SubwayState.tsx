import useSearchResultStore from "@/stores/searchResult";
import info from "../subway_info.json";
import type { realTimeArrivalListType } from "../types/ResponseType";
import LineState from "./LineState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
/**
 * 정왕역을 검색했을 때 에러가 발생하는데, 정왕역에는 4호선과 수인분당선이 지나고 있다.
 * 따라서 const subwayIdListString = searchResult.realtimeArrivalList[0].subwayList; 여기에 당연히 "1004,1075"가 올것
 * 이라고 생각했는데 첫 번째가 4호선만 있는 열차여서 "1004"가 되었고 당연히 1075를 추가하려고하니까 에러가 발생함
 * 그렇다면 subwayList중 가장 긴 것을 찾아서 하던가.. 아니면 Set 같은걸로 만들어야 겠는데?
 */

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
  const subwayObject: { [key: string]: realTimeArrivalListType[] } = {};

  searchResult.realtimeArrivalList.forEach((list) => {
    if (Object.keys(subwayObject).includes(list.subwayId)) {
      subwayObject[list.subwayId].push(list);
    } else {
      subwayObject[list.subwayId] = [list];
    }
  });

  return (
    searchResult && (
      <Tabs defaultValue={Object.keys(subwayObject)[0]}>
        <TabsList>
          {Object.keys(subwayObject).map((list) => {
            console.log("list", list);
            console.log("defaultValue", Object.keys(subwayObject)[0]);
            return (
              <TabsTrigger key={Math.random()} value={list}>
                {subwayInfo[list].name}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {Object.keys(subwayObject).map((list) => (
          <TabsContent key={Math.random()} value={list}>
            <LineState key={Math.random()} lineList={subwayObject[list]} />
          </TabsContent>
        ))}
      </Tabs>
    )
  );
};

export default SubwayState;
