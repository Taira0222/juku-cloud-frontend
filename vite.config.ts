/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    env: {
      VITE_API_BASE_URL: "http://api.example.com",
    },
    testTimeout: 7_000,
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // shadcn/ui のコンポーネントは除外
        "src/components/**",
        "src/hooks/useMobile.ts",
        // その他テスト不要なファイルを除外
        "src/pages/error/**",
        "src/pages/home/**",
        "src/Router/Router.tsx",
        "src/tests/**",
        "src/**/*.test.{ts,tsx}",
        "src/types/**",
        "src/**/types",
        "src/vite-env.d.ts",
        "src/main.tsx",
        "src/App.tsx",
        // 定数 src/constants/** , src/**/constants/**
        "src/constants/**",
        "src/**/constants/**",
      ],
    },
  },
});
