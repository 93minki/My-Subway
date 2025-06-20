import { useCallback } from "react";
import { toast } from "./use-toast";
import useWebSocket from "./useWebSocket";

const useSearchByWebsocket = () => {
  const ws = useWebSocket();

  const sendMessage = useCallback(
    (data: Record<string, unknown>) => {
      if (!ws.current) {
        toast({
          title: "연결 오류",
          description: "서버와 연결되지 않았습니다. 잠시 후 다시 시도해주세요.",
        });
        return false;
      }

      if (ws.current.readyState === WebSocket.OPEN) {
        try {
          ws.current.send(JSON.stringify(data));
          return true;
        } catch (error) {
          console.error("메시지 전송 오류:", error);
          toast({
            title: "전송 오류",
            description: "메시지 전송에 실패했습니다. 다시 시도해주세요.",
          });
          return false;
        }
      } else {
        toast({
          title: "연결 대기 중",
          description: "서버 연결을 확인 중입니다. 잠시 후 다시 시도해주세요.",
        });
        return false;
      }
    },
    [ws]
  );

  const sendTrackSubwayInfo = useCallback(
    (data: {
      type: string;
      subwayNumber: string;
      userId: string;
      stationName: string;
    }) => {
      return sendMessage(data);
    },
    [sendMessage]
  );

  const sendStopTracking = useCallback(
    (data: { type: string; userId: string }) => {
      return sendMessage(data);
    },
    [sendMessage]
  );

  const sendSearchWord = useCallback(
    (data: { type: string; searchWord: string; userId: string }) => {
      return sendMessage(data);
    },
    [sendMessage]
  );

  return { sendTrackSubwayInfo, sendSearchWord, sendStopTracking };
};

export default useSearchByWebsocket;
