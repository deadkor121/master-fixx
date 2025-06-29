import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { hashPassword, comparePassword, validateId } from "./utils/auth";
import { generateToken, verifyToken, type AuthRequest } from "./middleware/auth";

// --- Схеми валідації Zod ---

const insertUserSchema = z.object({
  email: z.string().email("Невірний формат email"),
  username: z.string().min(3, "Ім'я користувача повинне містити мінімум 3 символи"),
  password: z.string().min(6, "Пароль повинен бути мінімум 6 символів"),
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  userType: z.enum(["client", "master"]),
  // інші поля за потребою
});

const insertReviewSchema = z.object({
  masterId: z.number().int().positive(),
  rating: z.number().min(1).max(5),
  // тепер comment по замовчуванню пустий рядок, якщо не переданий
  comment: z.string().optional().default(""),
  clientId: z.number().int().positive(),
  bookingId: z.number().int().positive(),
  clientName: z.string().min(1),
});

const insertBookingSchema = z.object({
  description: z.string().min(1, "Опис замовлення обов'язковий"),
  masterId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  clientId: z.number().int().positive(),
  clientName: z.string().min(1, "Ім'я клієнта обов'язкове"),
  clientPhone: z.string().min(1, "Телефон клієнта обов'язковий"),
  address: z.string().min(1, "Адреса обов'язкова"),
  scheduledDate: z.string().refine(
    (dateStr) => !isNaN(Date.parse(dateStr)),
    { message: "Невірний формат дати" }
  ),
  scheduledTime: z.string().min(1, "Час замовлення обов'язковий"),
  estimatedPrice: z.string().optional(),
});

const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "Ім'я обов'язкове"),
  lastName: z.string().min(1, "Прізвище обов'язкове"),
  middleName: z.string().optional(),
  city: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  about: z.string().optional(),
  role: z.enum(["client", "master"]),
  category: z.string().nullable().optional(),
});

const insertServiceSchema = z.object({
  name: z.string().min(1, "Назва послуги обов'язкова"),
  description: z.string().min(1, "Опис обов'язковий"),
  price: z.string().min(1, "Ціна обов'язкова"),
  categoryId: z.number().int().positive(),
});

// Тип для оновлення профілю через з.infer
type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// --- Допоміжна функція очистки користувача від пароля ---
function sanitizeUser(user: any) {
  const { password, ...rest } = user;
  return rest;
}

// --- Основна функція реєстрації маршрутів ---
export async function registerRoutes(app: Express): Promise<Server> {
  // Регістрація користувача
  app.post("/api/auth/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Користувач з таким email вже існує" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Користувач з таким іменем вже існує" });
      }

      const hashedPassword = await hashPassword(userData.password);
      const userToCreate = { ...userData, password: hashedPassword };

      const user = await storage.createUser(userToCreate);

      const token = generateToken({
        id: user.id,
        email: user.email,
        userType: user.userType,
      });
      
      res.json({ user: sanitizeUser(user), token });
    } catch (error) {
      next(error);
    }
  });

  // Логін користувача
  app.post("/api/auth/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      const { email, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Невірний email або пароль" });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Невірний email або пароль" });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        userType: user.userType,
      });
      // Повертаємо користувача без пароля
      res.json({ user: sanitizeUser(user), token });
    } catch (error) {
      next(error);
    }
  });

  // Отримати всі категорії
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження категорій" });
    }
  });

  // Отримати категорію по ID
  app.get("/api/categories/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = validateId(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "Невірний ID категорії" });
      }

      const category = await storage.getServiceCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Категорію не знайдено" });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  });

  // Майстри (з опціональним фільтром за категорією)
  app.get("/api/masters", async (req: Request, res: Response) => {
    try {
      const category = req.query.category;
      let masters;

      if (typeof category === "string") {
        const categoryId = parseInt(category, 10);
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "Невірний ID категорії" });
        }
        masters = await storage.getMastersByCategory(categoryId);
      } else {
        masters = await storage.getAllMasters();
      }
      res.json(masters);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження майстрів" });
    }
  });

  // Майстер по ID
  app.get("/api/masters/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = validateId(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "Невірний ID майстра" });
      }

      const master = await storage.getMasterWithDetails(id);
      if (!master) {
        return res.status(404).json({ message: "Майстра не знайдено" });
      }
      res.json(master);
    } catch (error) {
      next(error);
    }
  });

  // Відгуки майстра
  app.get("/api/masters/:id/reviews", async (req: Request, res: Response) => {
    try {
      const masterId = parseInt(req.params.id, 10);
      if (isNaN(masterId)) {
        return res.status(400).json({ message: "Невірний ID майстра" });
      }
      const reviews = await storage.getReviewsByMaster(masterId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження відгуків" });
    }
  });

  // Створити відгук
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      // Тут можна додатково перевірити, чи користувач робив бронювання у майстра
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Помилка створення відгуку" });
    }
  });

  // Створити бронювання (з авторизацією)
  app.post("/api/bookings", verifyToken, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const bookingWithClient = {
        ...bookingData,
        clientId: req.user!.id,
      };
      const booking = await storage.createBooking(bookingWithClient);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });

  // Бронювання майстра
  app.get("/api/bookings/master/:masterId", async (req: Request, res: Response) => {
    try {
      const masterId = parseInt(req.params.masterId, 10);
      if (isNaN(masterId)) {
        return res.status(400).json({ message: "Невірний ID майстра" });
      }
      const bookings = await storage.getBookingsByMaster(masterId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження замовлень" });
    }
  });

  // Бронювання клієнта (з авторизацією та перевіркою доступу)
  app.get("/api/bookings/client/:clientId", verifyToken, async (req: AuthRequest, res: Response) => {
    try {
      const clientId = parseInt(req.params.clientId, 10);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "Невірний ID клієнта" });
      }
      // Перевірка: користувач може бачити лише свої бронювання
      if (req.user!.id !== clientId) {
        return res.status(403).json({ message: "Доступ заборонено" });
      }
      const bookings = await storage.getBookingsByClient(clientId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження замовлень" });
    }
  });

  // Оновлення статусу бронювання (додаткова перевірка прав може бути додана)
  app.patch("/api/bookings/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: "Невірний ID бронювання" });
      }
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Невірний статус" });
      }
      await storage.updateBookingStatus(id, status);
      res.json({ message: "Статус оновлено" });
    } catch (error) {
      res.status(500).json({ message: "Помилка оновлення статусу" });
    }
  });

  // Пошук майстрів
  app.get("/api/search", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, city, category } = req.query;
      let masters = await storage.getAllMasters();
      if (typeof category === "string") {
        const categoryId = parseInt(category, 10);
        if (!isNaN(categoryId)) {
          masters = masters.filter((master) =>
            master.services.some((service: any) => service.categoryId === categoryId)
          );
        }
      }
      if (typeof query === "string") {
        const searchTerm = query.toLowerCase();
        masters = masters.filter(
          (master) =>
            master.specialization.toLowerCase().includes(searchTerm) ||
            master.description.toLowerCase().includes(searchTerm) ||
            master.user.firstName.toLowerCase().includes(searchTerm) ||
            master.user.lastName.toLowerCase().includes(searchTerm)
        );
      }
      res.json(masters);
    } catch (error) {
      next(error);
    }
  });

  // Отримати профіль (з авторизацією)
  interface ProfileResponse {
    firstName: string;
    lastName: string;
    role: string;
    category?: string | null;
  }

  app.get("/api/profile", verifyToken, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "Користувача не знайдено" });
      }
      const profile: ProfileResponse = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.userType,
        category: user.category ?? null,
      };
      if (user.userType === "master") {
        const master = await storage.getMasterByUserId(user.id);
        if (master) {
          profile.category = master.specialization ?? "";
        }
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  // Оновлення профілю (з авторизацією) з використанням точного типу req.body
  app.put(
    "/api/profile",
    verifyToken,
    async (
      req: AuthRequest & { body: ProfileUpdateData },
      res: Response,
      next: NextFunction
    ) => {
      try {
        // Парсимо всі дані з req.body через схему
        const profileData = profileUpdateSchema.parse(req.body);
        
        // Оновлюємо профіль користувача (updateUserProfile має підтримувати оновлення додаткових полів)
        const updatedUser = await storage.updateUserProfile(req.user!.id, profileData);
        
        // Якщо користувач - майстер, оновлюємо і майстерський профіль
        if (profileData.role === "master") {
          await storage.updateMasterProfile(req.user!.id, {
            specialization: profileData.category || "",
            // При необхідності можна передати інші поля для майстерського профілю
          });
        }
        
        res.json(updatedUser);
      } catch (error) {
        next(error);
      }
    }
  );

// Отримати всі послуги майстра
app.get("/api/masters/:id/services", async (req: Request, res: Response) => {
  try {
    const masterId = parseInt(req.params.id, 10);
    if (isNaN(masterId)) {
      return res.status(400).json({ message: "Невірний ID майстра" });
    }
    const services = await storage.getServicesByMaster(masterId);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Помилка завантаження послуг" });
  }
});

// Додати послугу майстру
app.post("/api/masters/:id/services", async (req: Request, res: Response) => {
  try {
    const masterId = parseInt(req.params.id, 10);
    if (isNaN(masterId)) {
      return res.status(400).json({ message: "Невірний ID майстра" });
    }
    const serviceData = insertServiceSchema.parse(req.body);
    const newService = await storage.createService({
      ...serviceData,
      masterId,
    });
    res.json(newService);
  } catch (error) {
    res.status(400).json({ message: "Помилка створення послуги", error });
  }
});

// Оновити послугу
app.put("/api/services/:id", async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    if (isNaN(serviceId)) {
      return res.status(400).json({ message: "Невірний ID послуги" });
    }
    const serviceData = insertServiceSchema.parse(req.body);
    const updatedService = await storage.updateService(serviceId, serviceData);
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: "Помилка оновлення послуги", error });
  }
});

// Видалити послугу
app.delete("/api/services/:id", async (req: Request, res: Response) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    if (isNaN(serviceId)) {
      return res.status(400).json({ message: "Невірний ID послуги" });
    }
    await storage.deleteService(serviceId);
    res.json({ message: "Послугу видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення послуги" });
  }
});



  // Глобальний обробник помилок
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Помилка валідації даних",
        details: err.errors,
      });
    }
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  });

  // Створюємо і повертаємо HTTP сервер
  const httpServer = createServer(app);
  return httpServer;
}
