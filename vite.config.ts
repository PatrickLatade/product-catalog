import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  preview: {
    port: 4173,
    // 👇 Serve from the client build folder React Router created
    open: true,
  },
  build: {
    outDir: "build/client",
  },
});
