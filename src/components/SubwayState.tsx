import useSearchResultStore from "@/stores/searchResult";
import { useEffect, useState } from "react";
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

const SubwayState = () => {
  const searchResult = useSearchResultStore((state) => state.searchResult);
  console.log("searchResult 검색 결과 원본 데이터", searchResult);

  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [subwayObject, setSubwayObject] = useState<{
    [key: string]: realTimeArrivalListType[];
  }>({});
  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    if (
      ("status" in searchResult &&
        (searchResult.status < 200 || searchResult.status >= 300)) ||
      !("realtimeArrivalList" in searchResult) ||
      searchResult.realtimeArrivalList.length <= 0
    ) {
      // 데이터가 없거나 에러를 응답 받았을 경우
      const errMessage =
        "status" in searchResult ? searchResult.message : "데이터가 없습니다";
      setIsError(true);
      setErrMsg(errMessage);
    } else {
      const object = searchResult.realtimeArrivalList.reduce<{
        [key: string]: realTimeArrivalListType[];
      }>((acc, list) => {
        if (!acc[list.subwayId]) acc[list.subwayId] = [];
        acc[list.subwayId].push(list);
        return acc;
      }, {});
      setCurrentTab(Object.keys(object)[0]);
      setIsError(false);
      setSubwayObject(object);
    }
  }, [searchResult]);

  return isError ? (
    <div>{errMsg}</div>
  ) : (
    <Tabs defaultValue={currentTab}>
      <TabsList>
        {Object.keys(subwayObject).map((list) => {
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
  );
};

export default SubwayState;
