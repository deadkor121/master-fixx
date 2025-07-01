import "../server/env";
import express, { type Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import winston from "winston";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";

const app = express();
app.set("trust proxy", 1);
const isProd = process.env.NODE_ENV === "production";

// ─── Безпека ─────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://replit.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// ─── Rate Limits ─────────────────────────────────────────────────────────
if (isProd) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Забагато запитів, спробуйте пізніше" },
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Забагато спроб входу, спробуйте пізніше" },
  });

  app.use(limiter);
  app.use("/api/auth", authLimiter);
}

// ─── Body parsers ────────────────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

// ─── Winston logger ──────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console({ format: winston.format.simple() })],
});

// ─── Logging middleware ──────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: unknown;

  const originalResJson = res.json;
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalResJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// ─── Перевірка бази даних ────────────────────────────────────────────────
async function testConnection() {
  try {
    const result = await db.query.users.findMany();
    console.log("✅ DB connection OK:", result.length, "records");
  } catch (err) {
    console.error("❌ DB error:", err);
    process.exit(1);
  }
}

// ─── Головна логіка ──────────────────────────────────────────────────────
(async () => {
  await testConnection();

  await registerRoutes(app);

  const port = Number(process.env.PORT) || 5000;

  if (isProd) {
    serveStatic(app); // 🟡 Дуже важливо: до запуску сервера
  }

  const server = app.listen(port, "0.0.0.0", () => {
    log(`🚀 Server started on port ${port}`);
  });

  if (!isProd) {
    await setupVite(app, server);
  }

  // Graceful shutdown
  async function gracefulShutdown() {
    log("Отримано сигнал завершення, закриваємо сервер...");
    if (server) {
      server.close(async () => {
        log("HTTP сервер закрито");
        try {
          if (db && db.$client && typeof db.$client.end === "function") {
            await db.$client.end();
            log("Підключення до БД закрито");
          }
        } catch (err) {
          log("Помилка при закритті БД:", err instanceof Error ? err.message : String(err));
        }
        log("Вихід із процесу");
        process.exit(0);
      });

      // Примусовий вихід через 10 секунд, якщо close "зависне"
      setTimeout(() => {
        log("Примусовий вихід через таймаут");
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  }

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  // ── Глобальна обробка помилок ──
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    logger.error(message, { stack: err.stack });
  });
})();
