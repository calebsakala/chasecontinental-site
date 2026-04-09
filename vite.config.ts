import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("react-router-dom") ||
            id.includes("react-dom") ||
            id.includes("/react/")
          ) {
            return "react-core";
          }

          if (id.includes("@tanstack/react-query")) {
            return "react-query";
          }

          if (id.includes("@supabase/supabase-js")) {
            return "supabase-client";
          }

          if (
            id.includes("@sanity/client") ||
            id.includes("@sanity/image-url") ||
            id.includes("@portabletext/react")
          ) {
            return "cms-content";
          }

          if (id.includes("recharts")) {
            return "charts";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (id.includes("@radix-ui/")) {
            return "radix-ui";
          }
        },
      },
    },
  },
}));
