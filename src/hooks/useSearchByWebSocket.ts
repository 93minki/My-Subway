import { useWebSocket } from "@/provider/WebSocketProvider";
import { useCallback } from "react";

const useSearchByWebsocket = () => {
  const ws = useWebSocket();

  const sendTrackSubwayInfo = useCallback(
    (data: { type: string; subwayNumber: string; userId: string; searchWord: string }) => {
      console.log("data", data);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      }
    },
    [ws]
  );

  const sendSearchWord = useCallback(
    (data: { type: string; searchWord: string }) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      }
    },
    [ws]
  );

  return { sendTrackSubwayInfo, sendSearchWord };
};

export default useSearchByWebsocket;
