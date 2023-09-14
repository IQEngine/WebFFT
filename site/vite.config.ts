import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
    exclude: ["@mdx-js/react"],
  },
  plugins: [
    {
      enforce: "pre",
      ...mdx(),
    },
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }),
  ],
});
