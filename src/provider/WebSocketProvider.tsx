import { WS_ENDPOINT } from "@/constants";
import { toast } from "@/hooks/use-toast";
import useSearchResultStore from "@/stores/searchResult";
import useUserInfoStore from "@/stores/userInfo";
import React, {
  MutableRefObject,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );
  const userInfo = useUserInfoStore((state) => state.userInfo);

  const initializeWebSocket = useCallback(() => {
    console.log("WebSocket 연결 시도:", WS_ENDPOINT);
    ws.current = new WebSocket(`${WS_ENDPOINT}`);

    ws.current.onopen = () => {
      console.log("WebSocket 연결 성공");
      const userId = userInfo.id;
      ws.current?.send(JSON.stringify({ type: "init", userId }));
    };

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
      console.error("WebSocket Error: ", event);
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket Connection Closed", event);
      ws.current = null;
    };
  }, [setSearchResult, userInfo.id]);

  // 로그인된 사용자이고 메인 페이지일 때만 WebSocket 연결
  const shouldConnectWebSocket = useCallback(() => {
    return userInfo.id && location.pathname === "/";
  }, [userInfo.id, location.pathname]);

  const handleVisibilityChange = useCallback(() => {
    if (
      document.visibilityState === "visible" &&
      !ws.current &&
      shouldConnectWebSocket()
    ) {
      initializeWebSocket();
    }
  }, [initializeWebSocket, shouldConnectWebSocket]);

  useEffect(() => {
    // 조건을 만족할 때만 WebSocket 연결
    if (shouldConnectWebSocket() && !ws.current) {
      initializeWebSocket();
    }
    // 조건을 만족하지 않을 때 기존 연결 종료
    else if (!shouldConnectWebSocket() && ws.current) {
      ws.current.close();
      ws.current = null;
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      ws.current?.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange, initializeWebSocket, shouldConnectWebSocket]);

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};
