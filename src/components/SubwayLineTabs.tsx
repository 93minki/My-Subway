import useSearchResultStore from "@/stores/searchResult";
import type { realTimeArrivalListType } from "@/types/ResponseType";
import { AlertCircle, Train } from "lucide-react";
import { useEffect, useState } from "react";
import info from "../subway_info.json";
import SubwayLineInfo from "./SubwayLineInfo";
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

const SubwayLineTabs = () => {
  const storedSearchResult = useSearchResultStore(
    (state) => state.searchResult
  );
  const searchResult = storedSearchResult;

  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [subwayObject, setSubwayObject] = useState<{
    [key: string]: realTimeArrivalListType[];
  }>({});
  const [currentTab, setCurrentTab] = useState("");

  useEffect(() => {
    console.log("searchResult", searchResult);
    if (
      ("status" in searchResult &&
        (searchResult.status < 200 || searchResult.status >= 300)) ||
      !("realtimeArrivalList" in searchResult) ||
      searchResult.realtimeArrivalList.length <= 0
    ) {
      // 데이터가 없거나 에러를 응답 받았을 경우
      const errMessage =
        "status" in searchResult
          ? searchResult.message
          : "검색 결과가 없습니다";
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-sm w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-red-600 text-sm">{errMsg}</p>
          <p className="text-red-500 text-xs mt-2">
            역 이름을 정확히 입력했는지 확인해주세요
          </p>
        </div>
      </div>
    );
  }

  if (Object.keys(subwayObject).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Train className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-500 text-center">지하철 역을 검색해보세요</p>
      </div>
    );
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      className="flex flex-col w-full"
    >
      <div className="px-4 mb-6">
        <TabsList className="flex w-full h-auto bg-gray-100 p-1 rounded-2xl overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-full">
            {Object.keys(subwayObject).map((lineId) => {
              const lineInfo = subwayInfo[lineId];
              return (
                <TabsTrigger
                  key={Math.random()}
                  value={lineId}
                  className="flex-shrink-0 rounded-xl font-medium text-sm py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all whitespace-nowrap"
                  style={{
                    color: lineInfo ? lineInfo.color : "#666",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: lineInfo ? lineInfo.color : "#666",
                      }}
                    />
                    <span className="font-semibold">
                      {lineInfo ? lineInfo.name : `${lineId}호선`}
                    </span>
                  </div>
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>
      </div>
      {Object.keys(subwayObject).map((list) => (
        <TabsContent key={Math.random()} value={list} className="mt-0">
          <SubwayLineInfo lineList={subwayObject[list]} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default SubwayLineTabs;
