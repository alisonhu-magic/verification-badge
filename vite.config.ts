import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// GitHub Pages serves from https://<user>.github.io/verification-badge/
export default defineConfig({
  plugins: [react()],
  base: "/verification-badge/",
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    globals: true,
  },
});
