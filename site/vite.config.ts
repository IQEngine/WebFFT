import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  const mdx = await import("@mdx-js/rollup");
  return {
    optimizeDeps: {
      include: ["react/jsx-runtime"],
    },
    plugins: [
      react(),
      mdx.default({
        remarkPlugins: [],
      }),
    ],
  };
});
