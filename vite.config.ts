import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        name: "My Subway Info Realtime",
        short_name: "MySubway",
        start_url: "/",
        display: "standalone",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icons/app_logo_192.webp",
            sizes: "192x192",
            type: "image/webp",
          },
          {
            src: "/icons/app_logo_512.webp",
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
});
