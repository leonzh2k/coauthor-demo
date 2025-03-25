import fs from "node:fs/promises";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  return {
    root: ".",
    server: {
      open: false,
    },
    build: {
      outDir: "../../dist/public",
      sourcemap: true,
    },
    cacheDir: "../../node_modules/.vite",
    esbuild: {
      tsconfigRaw: await fs.readFile(
        new URL("./tsconfig.json", import.meta.url),
        "utf8"
      ),
    },
    plugins: [react()],
  };
});
