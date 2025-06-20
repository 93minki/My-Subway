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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );

  const getWebSocketUrl = useCallback(() => {
    // 환경변수가 있으면 사용, 없으면 자동 감지
    if (WS_ENDPOINT) {
      return WS_ENDPOINT;
    }

    // 자동 프로토콜 감지
    const host = window.location.host;

    // 개발환경과 프로덕션 환경 구분
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return `ws://${host.replace(":5173", ":9090")}`;
    } else {
      // 프로덕션 환경 - Railway 배포시 웹소켓 서버 주소
      return `wss://my-subway-server-production.up.railway.app`;
    }
  }, []);

  const initializeWebSocket = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      console.log("WebSocket 연결 시도:", wsUrl);

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket 연결 성공");
        // 재연결 타이머가 있다면 클리어
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
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
        toast({
          title: "연결 오류",
          description:
            "서버와의 연결에 문제가 발생했습니다. 잠시 후 다시 시도됩니다.",
        });
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket Connection Closed", event);
        ws.current = null;

        // 정상적인 종료가 아닌 경우에만 재연결 시도
        if (event.code !== 1000 && !reconnectTimeoutRef.current) {
          console.log("WebSocket 재연결 시도 중...");
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!ws.current) {
              initializeWebSocket();
            }
          }, 3000); // 3초 후 재연결 시도
        }
      };
    } catch (error) {
      console.error("WebSocket 초기화 오류:", error);
      toast({
        title: "연결 실패",
        description: "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
      });
    }
  }, [getWebSocketUrl, setSearchResult]);

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
      // 정리 작업
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close(1000); // 정상 종료 코드
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange, initializeWebSocket]);

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};
