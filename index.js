var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/env.ts
import dotenv from "dotenv";
dotenv.config();

// server/index.ts
import express2 from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import winston from "winston";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  insertBookingSchema: () => insertBookingSchema,
  insertMasterSchema: () => insertMasterSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertServiceCategorySchema: () => insertServiceCategorySchema,
  insertServiceSchema: () => insertServiceSchema,
  insertUserSchema: () => insertUserSchema,
  masters: () => masters,
  reviews: () => reviews,
  serviceCategories: () => serviceCategories,
  services: () => services,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(),
  // 'client' or 'master'
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  middleName: text("middle_name"),
  city: text("city"),
  // <--- добавить
  birthDate: text("birth_date"),
  // <--- добавить (или date, если используете date)
  gender: text("gender"),
  // <--- добавить
  about: text("about")
  // <--- добавить
});
var masters = pgTable("masters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  specialization: text("specialization").notNull(),
  description: text("description").notNull(),
  experience: text("experience").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isVerified: boolean("is_verified").default(false),
  avatar: text("avatar"),
  completedJobs: integer("completed_jobs").default(0),
  responseTime: text("response_time").default("< 30 \u0445\u0432"),
  repeatClients: integer("repeat_clients").default(0)
});
var serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull()
});
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  masterId: integer("master_id").notNull(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  masterId: integer("master_id").notNull(),
  serviceId: integer("service_id").notNull(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  address: text("address").notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending"),
  // 'pending', 'confirmed', 'completed', 'cancelled'
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  masterId: integer("master_id").notNull(),
  clientId: integer("client_id").notNull(),
  bookingId: integer("booking_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  clientName: text("client_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertMasterSchema = createInsertSchema(masters).omit({
  id: true,
  rating: true,
  reviewCount: true,
  completedJobs: true,
  repeatClients: true
});
var insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true
});
var insertServiceSchema = createInsertSchema(services).omit({
  id: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
var useSSL = process.env.DB_SSL === "true";
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? {
    rejectUnauthorized: false
    // отключает проверку сертификата (для dev или managed БД)
  } : false
});
console.log("DATABASE_URL:", process.env.DATABASE_URL);
var db = drizzle(pool, { schema: schema_exports });
console.log("Drizzle ORM initialized with schema:", Object.keys(schema_exports).join(", "));

// server/storage.ts
import { eq as eq2 } from "drizzle-orm";

// server/db-storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(user) {
    const result = await db.insert(users).values({ ...user, category: user.category ?? null }).returning();
    return result[0];
  }
  async updateUserProfile(userId, data) {
    const result = await db.update(users).set({
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName ?? null,
      city: data.city ?? null,
      birthDate: data.birthDate ?? null,
      gender: data.gender ?? null,
      about: data.about ?? null,
      category: data.category ?? null
    }).where(eq(users.id, userId)).returning();
    return result[0];
  }
  async updateMasterProfile(userId, data) {
    const result = await db.update(masters).set({
      specialization: data.specialization
    }).where(eq(masters.userId, userId)).returning();
    return result[0];
  }
  // Masters
  async getMaster(id) {
    const result = await db.select().from(masters).where(eq(masters.id, id));
    return result[0];
  }
  async getMasterByUserId(userId) {
    const result = await db.select().from(masters).where(eq(masters.userId, userId));
    return result[0];
  }
  async getMasterWithDetails(id) {
    const masterResult = await db.select({
      master: masters,
      user: {
        id: users.id,
        username: users.username,
        email: users.email,
        phone: users.phone,
        firstName: users.firstName,
        lastName: users.lastName,
        userType: users.userType,
        category: users.category,
        createdAt: users.createdAt,
        // Додай ці:
        about: users.about,
        birthDate: users.birthDate,
        middleName: users.middleName,
        gender: users.gender,
        city: users.city
      }
    }).from(masters).innerJoin(users, eq(masters.userId, users.id)).where(eq(masters.id, id));
    if (!masterResult[0]) return void 0;
    const masterServices = await this.getServicesByMaster(id);
    const categoriesResult = await db.select().from(serviceCategories);
    const category = categoriesResult[0] || {
      id: 1,
      name: "\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0456",
      description: "",
      icon: "",
      color: "blue",
      basePrice: "300"
    };
    return {
      ...masterResult[0].master,
      user: masterResult[0].user,
      services: masterServices,
      category
    };
  }
  async getAllMasters() {
    const mastersResult = await db.select({
      master: masters,
      user: {
        id: users.id,
        username: users.username,
        email: users.email,
        phone: users.phone,
        firstName: users.firstName,
        lastName: users.lastName,
        userType: users.userType,
        category: users.category,
        createdAt: users.createdAt,
        about: users.about,
        birthDate: users.birthDate,
        middleName: users.middleName,
        gender: users.gender,
        city: users.city
        // password: users.password, // НЕ добавляйте password!
      }
    }).from(masters).innerJoin(users, eq(masters.userId, users.id));
    const categoriesResult = await db.select().from(serviceCategories);
    const category = categoriesResult[0] || { id: 1, name: "\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0456", description: "", icon: "", color: "blue", basePrice: "300" };
    const mastersWithDetails = await Promise.all(
      mastersResult.map(async (result) => {
        const masterServices = await this.getServicesByMaster(result.master.id);
        return {
          ...result.master,
          user: result.user,
          // это PublicUser
          services: masterServices,
          category
        };
      })
    );
    return mastersWithDetails;
  }
  async getMastersByCategory(categoryId) {
    const allMasters = await this.getAllMasters();
    return allMasters.filter(
      (master) => master.services.some((service) => service.categoryId === categoryId)
    );
  }
  async createMaster(master) {
    const result = await db.insert(masters).values(master).returning();
    return result[0];
  }
  async updateMasterRating(masterId, rating, reviewCount) {
    await db.update(masters).set({ rating: rating.toString(), reviewCount }).where(eq(masters.id, masterId));
  }
  // Service Categories
  async getAllServiceCategories() {
    return await db.select().from(serviceCategories);
  }
  async getServiceCategory(id) {
    const result = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return result[0];
  }
  async createServiceCategory(category) {
    const result = await db.insert(serviceCategories).values(category).returning();
    return result[0];
  }
  // Services
  async getServicesByMaster(masterId) {
    return await db.select().from(services).where(eq(services.masterId, masterId));
  }
  async getService(id) {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }
  async createService(service) {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }
  async updateService(serviceId, data) {
    const result = await db.update(services).set(data).where(eq(services.id, serviceId)).returning();
    return result[0];
  }
  async deleteService(serviceId) {
    await db.delete(services).where(eq(services.id, serviceId));
  }
  // Bookings
  async getBooking(id) {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }
  async getBookingsByMaster(masterId) {
    const bookingsResult = await db.select().from(bookings).where(eq(bookings.masterId, masterId));
    return this.enrichBookings(bookingsResult);
  }
  async getBookingsByClient(clientId) {
    const bookingsResult = await db.select().from(bookings).where(eq(bookings.clientId, clientId));
    return this.enrichBookings(bookingsResult);
  }
  async enrichBookings(bookingsList) {
    return Promise.all(
      bookingsList.map(async (booking) => {
        const master = await this.getMasterWithDetails(booking.masterId);
        const service = await this.getService(booking.serviceId);
        const client = await this.getUser(booking.clientId);
        return {
          ...booking,
          master,
          service,
          client
        };
      })
    );
  }
  async createBooking(booking) {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }
  async updateBookingStatus(id, status) {
    await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  }
  // Reviews
  async getReviewsByMaster(masterId) {
    const reviewsResult = await db.select().from(reviews).where(eq(reviews.masterId, masterId));
    return Promise.all(
      reviewsResult.map(async (review) => {
        const master = await this.getMaster(review.masterId);
        const client = await this.getUser(review.clientId);
        return {
          ...review,
          master,
          client
        };
      })
    );
  }
  async createReview(review) {
    const result = await db.insert(reviews).values(review).returning();
    const masterReviews = await this.getReviewsByMaster(review.masterId);
    const avgRating = masterReviews.reduce((sum, r) => sum + r.rating, 0) / masterReviews.length;
    await this.updateMasterRating(review.masterId, avgRating, masterReviews.length);
    return result[0];
  }
};

// server/storage.ts
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";

// server/utils/auth.ts
import bcrypt from "bcrypt";
var SALT_ROUNDS = 12;
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
function validateId(id) {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
function generateToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "\u0422\u043E\u043A\u0435\u043D \u0434\u043E\u0441\u0442\u0443\u043F\u0443 \u0432\u0456\u0434\u0441\u0443\u0442\u043D\u0456\u0439" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0442\u043E\u043A\u0435\u043D \u0434\u043E\u0441\u0442\u0443\u043F\u0443" });
  }
}

// server/routes.ts
var insertUserSchema2 = z.object({
  email: z.string().email("\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email"),
  username: z.string().min(3, "\u0406\u043C'\u044F \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043F\u043E\u0432\u0438\u043D\u043D\u0435 \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u043C\u0456\u043D\u0456\u043C\u0443\u043C 3 \u0441\u0438\u043C\u0432\u043E\u043B\u0438"),
  password: z.string().min(6, "\u041F\u0430\u0440\u043E\u043B\u044C \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0431\u0443\u0442\u0438 \u043C\u0456\u043D\u0456\u043C\u0443\u043C 6 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432"),
  firstName: z.string().min(1, "\u0406\u043C'\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  lastName: z.string().min(1, "\u041F\u0440\u0456\u0437\u0432\u0438\u0449\u0435 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  userType: z.enum(["client", "master"])
  // інші поля за потребою
});
var insertReviewSchema2 = z.object({
  masterId: z.number().int().positive(),
  rating: z.number().min(1).max(5),
  // тепер comment по замовчуванню пустий рядок, якщо не переданий
  comment: z.string().optional().default(""),
  clientId: z.number().int().positive(),
  bookingId: z.number().int().positive(),
  clientName: z.string().min(1)
});
var insertBookingSchema2 = z.object({
  description: z.string().min(1, "\u041E\u043F\u0438\u0441 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  masterId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  clientId: z.number().int().positive(),
  clientName: z.string().min(1, "\u0406\u043C'\u044F \u043A\u043B\u0456\u0454\u043D\u0442\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  clientPhone: z.string().min(1, "\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u043A\u043B\u0456\u0454\u043D\u0442\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  address: z.string().min(1, "\u0410\u0434\u0440\u0435\u0441\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0430"),
  scheduledDate: z.string().refine(
    (dateStr) => !isNaN(Date.parse(dateStr)),
    { message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u0442\u0438" }
  ),
  scheduledTime: z.string().min(1, "\u0427\u0430\u0441 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  estimatedPrice: z.string().optional()
});
var profileUpdateSchema = z.object({
  firstName: z.string().min(1, "\u0406\u043C'\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  lastName: z.string().min(1, "\u041F\u0440\u0456\u0437\u0432\u0438\u0449\u0435 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  middleName: z.string().optional(),
  city: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  about: z.string().optional(),
  role: z.enum(["client", "master"]),
  category: z.string().nullable().optional()
});
var insertServiceSchema2 = z.object({
  name: z.string().min(1, "\u041D\u0430\u0437\u0432\u0430 \u043F\u043E\u0441\u043B\u0443\u0433\u0438 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0430"),
  description: z.string().min(1, "\u041E\u043F\u0438\u0441 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  price: z.string().min(1, "\u0426\u0456\u043D\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0430"),
  categoryId: z.number().int().positive()
});
function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res, next) => {
    try {
      const userData = insertUserSchema2.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \u0437 \u0442\u0430\u043A\u0438\u043C email \u0432\u0436\u0435 \u0456\u0441\u043D\u0443\u0454" });
      }
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447 \u0437 \u0442\u0430\u043A\u0438\u043C \u0456\u043C\u0435\u043D\u0435\u043C \u0432\u0436\u0435 \u0456\u0441\u043D\u0443\u0454" });
      }
      const hashedPassword = await hashPassword(userData.password);
      const userToCreate = { ...userData, password: hashedPassword };
      const user = await storage.createUser(userToCreate);
      const token = generateToken({
        id: user.id,
        email: user.email,
        userType: user.userType
      });
      res.json({ user: sanitizeUser(user), token });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/auth/login", async (req, res, next) => {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(1)
      });
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 email \u0430\u0431\u043E \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 email \u0430\u0431\u043E \u043F\u0430\u0440\u043E\u043B\u044C" });
      }
      const token = generateToken({
        id: user.id,
        email: user.email,
        userType: user.userType
      });
      res.json({ user: sanitizeUser(user), token });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0439" });
    }
  });
  app2.get("/api/categories/:id", async (req, res, next) => {
    try {
      const id = validateId(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457" });
      }
      const category = await storage.getServiceCategory(id);
      if (!category) {
        return res.status(404).json({ message: "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u044E \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E" });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/masters", async (req, res) => {
    try {
      const category = req.query.category;
      let masters3;
      if (typeof category === "string") {
        const categoryId = parseInt(category, 10);
        if (isNaN(categoryId)) {
          return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457" });
        }
        masters3 = await storage.getMastersByCategory(categoryId);
      } else {
        masters3 = await storage.getAllMasters();
      }
      res.json(masters3);
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043C\u0430\u0439\u0441\u0442\u0440\u0456\u0432" });
    }
  });
  app2.get("/api/masters/:id", async (req, res, next) => {
    try {
      const id = validateId(req.params.id);
      if (!id) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043C\u0430\u0439\u0441\u0442\u0440\u0430" });
      }
      const master = await storage.getMasterWithDetails(id);
      if (!master) {
        return res.status(404).json({ message: "\u041C\u0430\u0439\u0441\u0442\u0440\u0430 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E" });
      }
      res.json(master);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/masters/:id/reviews", async (req, res) => {
    try {
      const masterId = parseInt(req.params.id, 10);
      if (isNaN(masterId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043C\u0430\u0439\u0441\u0442\u0440\u0430" });
      }
      const reviews3 = await storage.getReviewsByMaster(masterId);
      res.json(reviews3);
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0432\u0456\u0434\u0433\u0443\u043A\u0456\u0432" });
    }
  });
  app2.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema2.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u0432\u0456\u0434\u0433\u0443\u043A\u0443" });
    }
  });
  app2.post("/api/bookings", verifyToken, async (req, res, next) => {
    try {
      const bookingData = insertBookingSchema2.parse(req.body);
      const bookingWithClient = {
        ...bookingData,
        clientId: req.user.id
      };
      const booking = await storage.createBooking(bookingWithClient);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/bookings/master/:masterId", async (req, res) => {
    try {
      const masterId = parseInt(req.params.masterId, 10);
      if (isNaN(masterId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043C\u0430\u0439\u0441\u0442\u0440\u0430" });
      }
      const bookings3 = await storage.getBookingsByMaster(masterId);
      res.json(bookings3);
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u044C" });
    }
  });
  app2.get("/api/bookings/client/:clientId", verifyToken, async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId, 10);
      if (isNaN(clientId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043A\u043B\u0456\u0454\u043D\u0442\u0430" });
      }
      if (req.user.id !== clientId) {
        return res.status(403).json({ message: "\u0414\u043E\u0441\u0442\u0443\u043F \u0437\u0430\u0431\u043E\u0440\u043E\u043D\u0435\u043D\u043E" });
      }
      const bookings3 = await storage.getBookingsByClient(clientId);
      res.json(bookings3);
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u044C" });
    }
  });
  app2.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (isNaN(id)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u0431\u0440\u043E\u043D\u044E\u0432\u0430\u043D\u043D\u044F" });
      }
      if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0441\u0442\u0430\u0442\u0443\u0441" });
      }
      await storage.updateBookingStatus(id, status);
      res.json({ message: "\u0421\u0442\u0430\u0442\u0443\u0441 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043E" });
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0441\u0442\u0430\u0442\u0443\u0441\u0443" });
    }
  });
  app2.get("/api/search", async (req, res, next) => {
    try {
      const { query, city, category } = req.query;
      let masters3 = await storage.getAllMasters();
      if (typeof category === "string") {
        const categoryId = parseInt(category, 10);
        if (!isNaN(categoryId)) {
          masters3 = masters3.filter(
            (master) => master.services.some((service) => service.categoryId === categoryId)
          );
        }
      }
      if (typeof query === "string") {
        const searchTerm = query.toLowerCase();
        masters3 = masters3.filter(
          (master) => master.specialization.toLowerCase().includes(searchTerm) || master.description.toLowerCase().includes(searchTerm) || master.user.firstName.toLowerCase().includes(searchTerm) || master.user.lastName.toLowerCase().includes(searchTerm)
        );
      }
      res.json(masters3);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/profile", verifyToken, async (req, res, next) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E" });
      }
      const profile = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.userType,
        category: user.category ?? null
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
  app2.put(
    "/api/profile",
    verifyToken,
    async (req, res, next) => {
      try {
        const profileData = profileUpdateSchema.parse(req.body);
        const updatedUser = await storage.updateUserProfile(req.user.id, profileData);
        if (profileData.role === "master") {
          await storage.updateMasterProfile(req.user.id, {
            specialization: profileData.category || ""
            // При необхідності можна передати інші поля для майстерського профілю
          });
        }
        res.json(updatedUser);
      } catch (error) {
        next(error);
      }
    }
  );
  app2.get("/api/masters/:id/services", async (req, res) => {
    try {
      const masterId = parseInt(req.params.id, 10);
      if (isNaN(masterId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043C\u0430\u0439\u0441\u0442\u0440\u0430" });
      }
      const services2 = await storage.getServicesByMaster(masterId);
      res.json(services2);
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043F\u043E\u0441\u043B\u0443\u0433" });
    }
  });
  app2.post("/api/masters/:id/services", async (req, res) => {
    try {
      const masterId = parseInt(req.params.id, 10);
      if (isNaN(masterId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043C\u0430\u0439\u0441\u0442\u0440\u0430" });
      }
      const serviceData = insertServiceSchema2.parse(req.body);
      const newService = await storage.createService({
        ...serviceData,
        masterId
      });
      res.json(newService);
    } catch (error) {
      res.status(400).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0441\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u043F\u043E\u0441\u043B\u0443\u0433\u0438", error });
    }
  });
  app2.put("/api/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id, 10);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043F\u043E\u0441\u043B\u0443\u0433\u0438" });
      }
      const serviceData = insertServiceSchema2.parse(req.body);
      const updatedService = await storage.updateService(serviceId, serviceData);
      res.json(updatedService);
    } catch (error) {
      res.status(400).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u043F\u043E\u0441\u043B\u0443\u0433\u0438", error });
    }
  });
  app2.delete("/api/services/:id", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.id, 10);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 ID \u043F\u043E\u0441\u043B\u0443\u0433\u0438" });
      }
      await storage.deleteService(serviceId);
      res.json({ message: "\u041F\u043E\u0441\u043B\u0443\u0433\u0443 \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043E" });
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043D\u044F \u043F\u043E\u0441\u043B\u0443\u0433\u0438" });
    }
  });
  app2.use((err, req, res, next) => {
    console.error("Error:", err);
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0432\u0430\u043B\u0456\u0434\u0430\u0446\u0456\u0457 \u0434\u0430\u043D\u0438\u0445",
        details: err.errors
      });
    }
    res.status(500).json({ message: "\u0412\u043D\u0443\u0442\u0440\u0456\u0448\u043D\u044F \u043F\u043E\u043C\u0438\u043B\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
var isProd = process.env.NODE_ENV === "production";
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
var limiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 минут
  max: isProd ? 100 : 1e3,
  // В продакшене максимум 100, в девелопменте 1000 (можно убрать)
  message: { message: "\u0417\u0430\u0431\u0430\u0433\u0430\u0442\u043E \u0437\u0430\u043F\u0438\u0442\u0456\u0432 \u0437 \u0446\u0456\u0454\u0457 IP-\u0430\u0434\u0440\u0435\u0441\u0438, \u0441\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0456\u0437\u043D\u0456\u0448\u0435" }
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: isProd ? 5 : 50,
  // В продакшене 5, в девелопменте 50
  message: { message: "\u0417\u0430\u0431\u0430\u0433\u0430\u0442\u043E \u0441\u043F\u0440\u043E\u0431 \u0432\u0445\u043E\u0434\u0443, \u0441\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0456\u0437\u043D\u0456\u0448\u0435" }
});
if (isProd) {
  app.use(limiter);
  app.use("/api/auth", authLimiter);
} else {
  app.use((req, res, next) => next());
  app.use("/api/auth", (req, res, next) => next());
}
app.use(express2.json({ limit: "5mb" }));
app.use(express2.urlencoded({ extended: false }));
var logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function testConnection() {
  try {
    const result = await db.query.users.findMany();
    console.log("\u2705 DB connection OK:", result.length, "records");
  } catch (error) {
    console.error("\u274C DB error:", error);
    process.exit(1);
  }
}
(async () => {
  await testConnection();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT) || 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`\u{1F680} Server started on port ${port}`);
  });
})();
