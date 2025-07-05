import type { UserConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default async (): Promise<UserConfig> => {
  const plugins: PluginOption[] = [react()];

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").then(m => m.default);
      const cartographer = await import("@replit/vite-plugin-cartographer").then(m => m.cartographer);
      plugins.push(runtimeErrorOverlay());
      plugins.push(cartographer());
    } catch (err: unknown) {
      console.warn("⚠ Не вдалося підключити Replit-плагіни:", err instanceof Error ? err.message : String(err));
    }
  }

  return {
    base: "/",
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "vendor-react";
              if (id.includes("zod")) return "vendor-zod";
              return "vendor";
            }
          },
        },
      },
    },
  };
};