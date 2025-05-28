import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import { hashPassword, comparePassword, validateId } from "./utils/auth";
import { generateToken, verifyToken, optionalAuth, type AuthRequest } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Користувач з таким email вже існує" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Користувач з таким іменем вже існує" });
      }

      // Hash password before storing
      const hashedPassword = await hashPassword(userData.password);
      const userToCreate = { ...userData, password: hashedPassword };

      const user = await storage.createUser(userToCreate);
      
      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        userType: user.userType
      });

      res.json({ 
        user: { ...user, password: undefined },
        token 
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email та пароль обов'язкові" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Невірний email або пароль" });
      }

      // Compare hashed password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Невірний email або пароль" });
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        userType: user.userType
      });

      res.json({ 
        user: { ...user, password: undefined },
        token 
      });
    } catch (error) {
      next(error);
    }
  });

  // Service categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження категорій" });
    }
  });

  app.get("/api/categories/:id", async (req, res, next) => {
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

  // Masters
  app.get("/api/masters", async (req, res) => {
    try {
      const { category } = req.query;
      
      let masters;
      if (category) {
        const categoryId = parseInt(category as string);
        masters = await storage.getMastersByCategory(categoryId);
      } else {
        masters = await storage.getAllMasters();
      }

      res.json(masters);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження майстрів" });
    }
  });

  app.get("/api/masters/:id", async (req, res, next) => {
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

  // Reviews
  app.get("/api/masters/:id/reviews", async (req, res) => {
    try {
      const masterId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByMaster(masterId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження відгуків" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Помилка створення відгуку" });
    }
  });

  // Bookings
  app.post("/api/bookings", verifyToken, async (req: AuthRequest, res, next) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Add client ID from authenticated user
      const bookingWithClient = {
        ...bookingData,
        clientId: req.user!.id
      };
      
      const booking = await storage.createBooking(bookingWithClient);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/bookings/master/:masterId", async (req, res) => {
    try {
      const masterId = parseInt(req.params.masterId);
      const bookings = await storage.getBookingsByMaster(masterId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження замовлень" });
    }
  });

  app.get("/api/bookings/client/:clientId", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const bookings = await storage.getBookingsByClient(clientId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Помилка завантаження замовлень" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Невірний статус" });
      }

      await storage.updateBookingStatus(id, status);
      res.json({ message: "Статус оновлено" });
    } catch (error) {
      res.status(500).json({ message: "Помилка оновлення статусу" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const { query, city, category } = req.query;
      
      let masters = await storage.getAllMasters();
      
      if (category) {
        const categoryId = parseInt(category as string);
        masters = masters.filter(master => 
          master.services.some(service => service.categoryId === categoryId)
        );
      }

      if (query) {
        const searchTerm = (query as string).toLowerCase();
        masters = masters.filter(master =>
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

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Error:", err);
    
    if (err.name === 'ZodError') {
      return res.status(400).json({ 
        message: "Помилка валідації даних",
        details: err.errors 
      });
    }
    
    res.status(500).json({ 
      message: "Внутрішня помилка сервера" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
