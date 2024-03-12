import useSearchResultStore from "@/stores/searchResult";
import { useRef } from "react";

const useSearch = () => {
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );
  const eventSourceRef = useRef<EventSource | null>(null);

  const searchSubway = async (searchWord: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    eventSourceRef.current = new EventSource(
      `http://localhost:9090/subway-info?searchWord=${searchWord}`,
      {
        withCredentials: true,
      }
    );
    console.log("credentials", eventSourceRef.current.withCredentials);
    eventSourceRef.current.onmessage = function (event: MessageEvent) {
      const data = JSON.parse(event.data);
      setSearchResult(data);
    };
    eventSourceRef.current.onerror = function (error: Event | string) {
      console.error("eventSourceRef failed:", error);
      // 필요한 에러 처리 로직을 추가합니다.
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  };

  return { searchSubway };
};

export default useSearch;
