import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      injectManifest: {
        swSrc: "src/sw.js", // 원본 서비스 워커 파일 경로
      },
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "robots.txt", "icons/*"], // 'icons/*' 추가
      manifest: {
        name: "My Subway Info Realtime",
        short_name: "MySubway",
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "icons/app_logo_192.webp",
            sizes: "192x192",
            type: "image/webp",
          },
          {
            src: "icons/app_logo_512.webp",
            sizes: "512x512",
            type: "image/webp",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
