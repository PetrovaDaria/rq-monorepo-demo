/** @type {import('vite').UserConfig} */
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { cpus } from "os";
import {
  CommonServerOptions,
  defineConfig,
  loadEnv,
  normalizePath,
  splitVendorChunkPlugin,
} from "vite";
import checker from "vite-plugin-checker";
import progress from "vite-plugin-progress";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  const legacyCRAEnv = loadEnv(mode, process.cwd(), "REACT_APP");

  const env = { ...legacyCRAEnv, ...viteEnv };

  console.log({ mode, env });

  return {
    // https://github.com/apollographql/apollo-client/issues/10445
    // https://stackoverflow.com/questions/74990851/vite-build-is-throwing-could-not-resolve-internals-window-from-inter
    define: {
      ...(mode === "development" ? { global: "window" } : {}),
      "process.env": env,
    },
    root: normalizePath(path.resolve("./")),
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    plugins: [
      splitVendorChunkPlugin(),
      react({
        tsDecorators: true,
      }),
      svgr(),
      progress(),
      tsconfigPaths(),
      mode === "development" &&
      checker({
        overlay: {
          position: "br",
        },
        typescript: mode === "development",
        // eslint: {
        //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        //   dev: {
        //     logLevel: ["error"],
        //   },
        // },
      }),
    ].filter(Boolean),

    server: {
      port: 51300,
      cors: false,
      hmr: {
        overlay: false,
      },
    },

    preview: {
      port: 51300,
    },

    // https://vitejs.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies
    optimizeDeps: {
      // include: ["ui", "bank-guarantee"],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    build: {
      minify:
        env["VITE_APP_STAND_LAYER"] === "prod" ||
        env["VITE_APP_STAND_LAYER"] === "beta",
      cache: false,
      sourcemap: mode === "development",
      rollupOptions: {
        maxParallelFileOps: Math.max(1, cpus().length - 1),
      },
      commonjsOptions: {
        include: [/node_modules/],
      },
    },
    test: {
      // чтобы положить методы и объекты в глобальное окружение
      // тогда не надо будет прописывать импорты describe, it, etc...
      globals: true,
      setupFiles: ["./src/setupTests.ts"],
      environment: "jsdom",
    },
  };
});
