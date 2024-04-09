import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  moduleNameMapper: {
    "^.+\\.svg$": "jest-svg-transformer",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  globals: {
    "import.meta": {
      env: {
        VITE_API_ENDPOINT: "http://localhost:9090",
        VITE_WS_ENDPOINT: "ws://localhost:9090",
        VITE_VAPID_PUBLIC_KEY:
          "BC7SNZAvIUvYNP2_zb8O0aMSNaAEw5jguX2gRHjuf9hy34ZiRz-p9wmeZDDxrbH1cCYtnjehxI3GLYJ_g9gXwic",
      },
    },
  },
};

export default config;
