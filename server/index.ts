import "../server/env"; 
import express, { type Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import winston from "winston";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db"; // Импорт базы данных

const app = express();

const isProd = process.env.NODE_ENV === "production";

// Security middleware (helmet с CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting - общий лимит на все запросы
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: isProd ? 100 : 1000, // В продакшене максимум 100, в девелопменте 1000 (можно убрать)
  message: { message: "Забагато запитів з цієї IP-адреси, спробуйте пізніше" },
});

// Rate limiting - для роутов аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 5 : 50, // В продакшене 5, в девелопменте 50
  message: { message: "Забагато спроб входу, спробуйте пізніше" },
});

// Подключаем лимитеры только в продакшене
if (isProd) {
  app.use(limiter);
  app.use('/api/auth', authLimiter);
} else {
  // В режиме разработки лимиты отключены
  app.use((req, res, next) => next());
  app.use('/api/auth', (req, res, next) => next());
}

// Body parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

// Logger (winston)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
  ],
});

// Middleware для логирования запросов и ответов (с подсчетом времени)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Проверка подключения к базе данных
async function testConnection() {
  try {
    const result = await db.query.users.findMany();
    console.log("✅ DB connection OK:", result.length, "records");
  } catch (error) {
    console.error("❌ DB error:", error);
    process.exit(1);
  }
}

(async () => {
  await testConnection();

  const server = await registerRoutes(app);

  // Обработка ошибок
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Vite - только для разработки
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT) || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`🚀 Server started on port ${port}`);
  });
})();
