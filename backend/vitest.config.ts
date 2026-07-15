import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",

    // Solo ejecutar pruebas de Vitest
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "backend/tests/**/*.test.ts"
    ],

    // Ignorar Playwright
    exclude: [
      "e2e/**",
      "backend/e2e/**",
      "node_modules/**"
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],

      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
  },
});