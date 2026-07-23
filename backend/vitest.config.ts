import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",

    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
    ],

    exclude: [
      "e2e/**",
      "node_modules/**",
      "dist/**",
      "coverage/**",
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