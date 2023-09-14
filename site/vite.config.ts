import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig({
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
