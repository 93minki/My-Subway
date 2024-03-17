import useSearchResultStore from "@/stores/searchResult";
import React, { createContext, useContext, useEffect, useRef } from "react";

// WebSocketContext에 대한 TypeScript 타입을 정의합니다.
interface IWebSocketContext {
  ws: React.MutableRefObject<WebSocket | null>;
}

// WebSocketContext를 생성할 때 null이 아닌, 실제 타입으로 초기화합니다.
const WebSocketContext = createContext<IWebSocketContext | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useRef<WebSocket | null>(null);
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );
  useEffect(() => {
    if (!ws.current) {
      console.log("연결 시도");
      ws.current = new WebSocket(`${import.meta.env.VITE_WS_ENDPOINT}`);

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("message?", message);
        setSearchResult(message);
      };

      ws.current.onerror = (event) => {
        console.error("Websocket Error: ", event);
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket Connection Closed", event);
        ws.current = null;
      };
    }

    return () => {
      ws.current?.close();
    };
  }, []);

  // context 값에는 ws를 포함하는 객체를 전달합니다.
  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// 이 훅은 WebSocket 인스턴스를 반환합니다.
export const useWebSocket = (): React.MutableRefObject<WebSocket | null> => {
  const context = useContext(WebSocketContext);
  if (context === null) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context.ws;
};
