import { WS_ENDPOINT } from "@/constants";
import { toast } from "@/hooks/use-toast";
import useSearchResultStore from "@/stores/searchResult";
import React, {
  MutableRefObject,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface WebSocketContextType {
  ws: MutableRefObject<WebSocket | null>;
}

export const WebSocketContext = createContext<WebSocketContextType | null>(
  null
);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useRef<WebSocket | null>(null);
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );

  const initializeWebSocket = useCallback(() => {
    console.log("WebSocket 연결 시도");
    ws.current = new WebSocket(`${WS_ENDPOINT}`);
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { type, data } = message;
      if (type === "subway_data") {
        setSearchResult(data);
      } else if (type === "tracking_started") {
        console.log("tracking_started", data);
        toast({
          title: "지하철 추적 시작",
          description: "선택하신 지하철의 실시간 위치 추적을 시작했습니다.",
        });
      } else if (type === "state_restored") {
        toast({
          title: "이전 검색 이어하기",
          description: "이전 검색 결과를 이어서 보여드립니다.",
        });
      } else if (type === "error") {
        toast({
          title: "Web Push 알림 오류",
          description: "Web Push 알림 오류가 발생했습니다.",
        });
      } else if (type === "tracking_stopped") {
        toast({
          title: "추적 중단",
          description: "선택하신 지하철의 실시간 위치 추적을 중단했습니다.",
        });
      }
    };

    ws.current.onerror = (event) => {
      console.error("Websocket Error: ", event);
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket Connection Closed", event);
      ws.current = null;
    };
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible" && !ws.current) {
      initializeWebSocket();
    }
  }, [initializeWebSocket]);

  useEffect(() => {
    if (!ws.current) {
      initializeWebSocket();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      ws.current?.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange, initializeWebSocket]);

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};
