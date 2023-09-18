/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
    },
    environment: "jsdom", // to be able to unit test localStorage
  },
});
