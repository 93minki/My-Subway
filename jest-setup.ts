import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers } from "./src/__mocks__/handler";

export const server = setupServer(...handlers);

server.events.on("request:start", ({ request }) => {
  console.log("MSW intercepted:", request.method, request.url);
});

jest.mock("@/constants", () => ({
  API_ENDPOINT: "http://localhost:9090",
  WS_ENDPOINT: "ws://localhost:9090",
  VAPID_PUBLIC_KEY: "BC7SNZAvIUvYNPc",
}));

globalThis.Notification = {
  requestPermission: jest.fn(),
  permission: "granted",
} as unknown as jest.Mocked<typeof Notification>;

beforeAll(() => {
  console.log("서버 시작");
  server.listen({ onUnhandledRequest: "warn" });
});

afterEach(() => {
  console.log("핸들러 리셋");
  server.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => {
  console.log("서버 닫기");
  jest.resetAllMocks();
  server.close();
});
const localStorageMock = (function () {
  let store = {} as Storage;

  return {
    getItem(key: string) {
      return store[key];
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {} as Storage;
    },
    removeItem(key: string) {
      delete store[key];
    },
    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });
