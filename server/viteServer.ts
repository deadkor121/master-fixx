import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer, type ViteDevServer } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";
import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function createViteConfig() {
  const plugins: PluginOption[] = [react()];

  // Add Replit plugins if available in development
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").then(m => m.default);
      const cartographer = await import("@replit/vite-plugin-cartographer").then(m => m.cartographer);
      plugins.push(runtimeErrorOverlay());
      plugins.push(cartographer());
    } catch (err: unknown) {
      console.warn("⚠ Could not load Replit plugins:", err instanceof Error ? err.message : String(err));
    }
  }

  const rootDir = path.resolve(__dirname, "..");
  
  return {
    base: "/",
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "client", "src"),
        "@shared": path.resolve(rootDir, "shared"),
        "@assets": path.resolve(rootDir, "attached_assets"),
      },
    },
    root: path.resolve(rootDir, "client"),
    build: {
      outDir: path.resolve(rootDir, "dist/public"),
      emptyOutDir: true,
    },
  };
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const viteServer: ViteDevServer = await createServer({
    ...(await createViteConfig()),
    configFile: false,
    server: {
      middlewareMode: true,
      hmr: { server },
     
    },
  });

  app.use(viteServer.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}


export function serveStatic(app: express.Express) {
  const distPath = path.resolve(process.cwd(), "dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
// Статика
app.use(
  express.static(distPath, {
    maxAge: "7d",
    immutable: true,
  })
);

// SPA fallback — только если не найдено ничего ранее
app.get("*", (req, res, next) => {
  const filePath = path.join(distPath, req.path);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  res.sendFile(path.join(distPath, "index.html"));
});
}