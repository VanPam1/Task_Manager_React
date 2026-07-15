import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",

    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**",
      "**/playwright-report/**",
      "**/test-results/**"
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],

      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
});