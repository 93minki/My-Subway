import { WebSocketContext } from "@/provider/WebSocketProvider";
import { MutableRefObject, useContext } from "react";

const useWebSocket = (): MutableRefObject<WebSocket | null> => {
  const context = useContext(WebSocketContext);
  if (context === null) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context.ws;
};

export default useWebSocket;
