import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    env: {
      ADMIN_EMAIL: "admin@studiopilot.io",
      ADMIN_PASSWORD: "TestAdminPassword2026!MinLength",
      AUTH_SESSION_SECRET: "test_session_secret_with_more_than_32_characters_for_unit_tests",
      ENABLE_LOCAL_STORAGE_FALLBACK: "true",
      SEARCH_PROVIDER: "duckduckgo",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
