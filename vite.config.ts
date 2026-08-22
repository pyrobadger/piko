import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config.ts";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    // Chrome extensions need this to avoid issues with dynamic imports
    rollupOptions: {
      output: {
        // Use a predictable chunk naming pattern
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Target modern Chrome
    target: "esnext",
    // Don't minify for easier debugging in dev
    minify: false,
  },
  server: {
    // Required for CRXJS HMR in extensions
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
});
