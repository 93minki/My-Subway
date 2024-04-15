import { WS_ENDPOINT } from "@/constants";
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
