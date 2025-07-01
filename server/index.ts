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
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://replit.com"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

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

let server: ReturnType<typeof app.listen> | null = null;

async function gracefulShutdown() {
  log("Получен сигнал завершения, закрываем сервер...");
  if (server) {
    server.close(() => {
      log("Сервер закрыт. Выход из процесса.");
      // Если есть подключение к БД, его также надо закрыть, например:
      // await db.close();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Обработка сигналов завершения процесса
process.on("SIGTERM", () => {
  log("SIGTERM получен");
  gracefulShutdown();
});

process.on("SIGINT", () => {
  log("SIGINT получен");
  gracefulShutdown();
});

// Обработка необработанных исключений и промисов
process.on("uncaughtException", (err) => {
  logger.error("Необработанное исключение:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Необработанное отклонение промиса:", reason);
});

(async () => {
  await testConnection();

  await registerRoutes(app);

  const port = Number(process.env.PORT) || 5000;

  if (isProd) {
    serveStatic(app); // 🟡 Дуже важливо: до запуску сервера
  }

  server = app.listen(port, "0.0.0.0", () => {
    log(`🚀 Server started on port ${port}`);
  });

  if (!isProd) {
    await setupVite(app, server);
  }

  // ── Глобальна обробка помилок ──
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    logger.error(message, { stack: err.stack });
  });
})();
