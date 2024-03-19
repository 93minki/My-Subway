import useSearchResultStore from "@/stores/searchResult";
import React, {
  MutableRefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

interface WebSocketContextType {
  ws: MutableRefObject<WebSocket | null>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

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
  }, [setSearchResult]);

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
