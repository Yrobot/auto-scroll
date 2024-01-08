import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

enum TYPES {
  PACKAGE = "PACKAGE",
  WEBSITE = "WEBSITE",
}

const type = process.env.type || TYPES.WEBSITE;

const TYPE_CONFIG_MAP = {
  [TYPES.PACKAGE]: {
    build: {
      lib: {
        entry: "package/index.ts",
        name: "autoScroll",
        formats: ["es", "iife"],
        fileName: (format) => `index.${format}.js`,
      },
      outDir: "build",
    },
    plugins: [dts()],
    esbuild: {
      minify: true,
    },
  },
  [TYPES.WEBSITE]: {
    base: "./",
    build: {
      outDir: "build_website",
    },
    publicDir: "website/public",
    esbuild: {
      minify: false,
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  ...TYPE_CONFIG_MAP[type],
});
