import useSearchResultStore from "@/stores/searchResult";
import { useCallback, useEffect, useRef, useState } from "react";

const useSearch = () => {
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );
  const eventSourceRef = useRef<EventSource | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [shouldRetry, setShouldRetry] = useState(true);

  const connectEventSource = useCallback(
    (searchWord: string) => {
      if (!shouldRetry) return;

      if (!eventSourceRef.current) {
        eventSourceRef.current = new EventSource(
          `http://localhost:9090/subway-info?searchWord=${searchWord}`,
          { withCredentials: true }
        );
        console.log("event source 추가");
        console.log("eventSource", eventSourceRef);

        eventSourceRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setSearchResult(data);
        };

        eventSourceRef.current.onerror = () => {
          if (retryCount < maxRetries && shouldRetry) {
            setTimeout(() => {
              setRetryCount((currentCount) => currentCount + 1);
              connectEventSource(searchWord);
            }, 5000);
          } else {
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
            }
            eventSourceRef.current = null;
          }
        };
      }
    },
    [retryCount, maxRetries, shouldRetry, setSearchResult]
  );

  const closeConnection = useCallback(() => {
    console.log("연결을 해제합니다.");
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setShouldRetry(false);
  }, []);

  const searchSubway = useCallback(
    (searchWord: string) => {
      setRetryCount(0);
      setShouldRetry(true);
      connectEventSource(searchWord);
    },
    [connectEventSource]
  );

  // 페이지를 떠날 때 연결을 닫기 위한 로직
  useEffect(() => {
    const handleUnload = () => {
      closeConnection();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      // 컴포넌트 언마운트 시 연결 해제
      closeConnection();
    };
  }, [closeConnection]);

  return { searchSubway, closeConnection };
};

export default useSearch;
