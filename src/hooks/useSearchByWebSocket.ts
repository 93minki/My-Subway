import { useCallback } from "react";
import useWebSocket from "./useWebSocket";

const useSearchByWebsocket = () => {
  const ws = useWebSocket();

  const sendTrackSubwayInfo = useCallback(
    (data: {
      type: string;
      subwayNumber: string;
      userId: string;
      stationName: string;
    }) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      }
    },
    [ws]
  );

  const sendStopTracking = useCallback(
    (data: { type: string; userId: string }) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      }
    },
    [ws]
  );

  const sendSearchWord = useCallback(
    (data: { type: string; searchWord: string; userId: string }) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      }
    },
    [ws]
  );

  return { sendTrackSubwayInfo, sendSearchWord, sendStopTracking };
};

export default useSearchByWebsocket;
