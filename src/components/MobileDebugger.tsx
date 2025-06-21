import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  level: "log" | "warn" | "error" | "info";
  message: string;
}

export default function MobileDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logId, setLogId] = useState(0);

  useEffect(() => {
    // 기존 console 메소드들을 저장
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    // console 메소드들을 오버라이드
    console.log = (...args) => {
      originalLog(...args);
      addLog("log", args.join(" "));
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog("warn", args.join(" "));
    };

    console.error = (...args) => {
      originalError(...args);
      addLog("error", args.join(" "));
    };

    console.info = (...args) => {
      originalInfo(...args);
      addLog("info", args.join(" "));
    };

    // cleanup
    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, []);

  const addLog = (level: LogEntry["level"], message: string) => {
    const newLog: LogEntry = {
      id: logId,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    };

    setLogs((prev) => [...prev.slice(-49), newLog]); // 최대 50개까지만 유지
    setLogId((prev) => prev + 1);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-600";
      case "warn":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-700";
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          🐛
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end">
      <div className="bg-white w-full h-2/3 rounded-t-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-medium text-gray-900">모바일 콘솔</h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={clearLogs}
              size="sm"
              variant="outline"
              className="h-8"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="outline"
              className="h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Logs */}
        <div className="h-full overflow-y-auto p-3 space-y-1 text-xs font-mono">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              로그가 없습니다
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="border-b border-gray-100 pb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-xs">{log.timestamp}</span>
                  <span
                    className={`font-medium text-xs ${getLevelColor(log.level)}`}
                  >
                    [{log.level.toUpperCase()}]
                  </span>
                </div>
                <div className="mt-1 break-words">{log.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
