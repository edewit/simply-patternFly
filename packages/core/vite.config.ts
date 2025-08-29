import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  css: {
    // Disable CSS code splitting and tree-shaking to preserve all PatternFly styles
    devSourcemap: true,
    preprocessorOptions: {},
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SimplyPatternflyCore",
      formats: ["es"],
      fileName: "index",
    },
    // Disable CSS code splitting to ensure all styles are included
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: "styles.[ext]",
        // Preserve all CSS without minification that might remove "unused" classes
        compact: false,
      },
    },
  },
});
