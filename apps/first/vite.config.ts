import react from "@vitejs/plugin-react-swc";
import { CommonServerOptions, UserConfig, defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import progress from "vite-plugin-progress";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const craEnv = loadEnv(mode, process.cwd(), "REACT_APP");
  const viteEnv = loadEnv(mode, process.cwd());
  const nodeEnv = loadEnv(mode, process.cwd(), "");

  const config: UserConfig = {
    // https://github.com/apollographql/apollo-client/issues/10445
    // https://stackoverflow.com/questions/74990851/vite-build-is-throwing-could-not-resolve-internals-window-from-inter
    define: {
      //  https://github.com/getsentry/sentry-javascript/issues/4473
      ...(mode === "development" ? { global: "window" } : {}),
      "process.env": { ...craEnv, ...viteEnv },
    },

    base: nodeEnv.PUBLIC_URL,

    resolve: {
      dedupe: ["react", "react-dom"],
    },

    plugins: [
      ViteEjsPlugin((viteConfig) => ({
        env: viteConfig.env,
      })),
      react({
        tsDecorators: true,
      }),
      svgr(),
      progress(),
      tsconfigPaths(),
    ].filter(Boolean),

    server: {
      port: 51200,
      cors: false,
    },

    // https://vitejs.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies
    // optimizeDeps: {
    // include: ["ui"],
    // },
    build: {
      commonjsOptions: {
        include: [/ui/, /node_modules/],
      },
    },
  };

  return config;
});