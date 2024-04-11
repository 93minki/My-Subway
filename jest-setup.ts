import "@testing-library/jest-dom";

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

Object.defineProperty(window, "localStorage", { value: localStorageMock });
