import useSearchResultStore from "@/stores/searchResult";
import { useCallback, useEffect, useRef } from "react";

const useSearchByWebsocket = () => {
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`${import.meta.env.VITE_WS_ENDPOINT}`);
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("message?", JSON.parse(event.data));
      setSearchResult(message);
    };

    ws.current.onerror = (event) => {
      console.error("Websocket Error: ", event);
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket Connection Closed", event);
    };

    return () => {
      ws.current?.close();
    };
  }, [setSearchResult]);

  const sendTrackSubwayInfo = useCallback(
    (data: { type: string; subwayNumber: string }) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      }
    },
    []
  );

  const sendSearchWord = useCallback(
    (data: { type: string; searchWord: string }) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      }
    },
    []
  );

  return { sendTrackSubwayInfo, sendSearchWord };
};

export default useSearchByWebsocket;
