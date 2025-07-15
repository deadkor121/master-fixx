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
  insertMessageSchema: () => insertMessageSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertServiceCategorySchema: () => insertServiceCategorySchema,
  insertServiceSchema: () => insertServiceSchema,
  insertUserSchema: () => insertUserSchema,
  masters: () => masters,
  messages: () => messages,
  reviews: () => reviews,
  serviceCategories: () => serviceCategories,
  services: () => services,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
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
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull().default(0),
  text: text("text").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull()
});
var insertMessageSchema = z.object({
  bookingId: z.number(),
  receiverId: z.number(),
  text: z.string().min(1),
  sentAt: z.string().optional()
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
  // Messages
  async getMessagesByBooking(bookingId) {
    const result = await db.select({
      id: messages.id,
      bookingId: messages.bookingId,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      // ← ДОДАЙ ЦЕ
      text: messages.text,
      sentAt: messages.sentAt,
      senderName: users.firstName
    }).from(messages).leftJoin(users, eq(messages.senderId, users.id)).where(eq(messages.bookingId, bookingId));
    return result.map((msg) => ({
      ...msg,
      sentAt: msg.sentAt instanceof Date ? msg.sentAt.toISOString() : String(msg.sentAt),
      senderName: msg.senderName
    }));
  }
  async createMessage(message) {
    const result = await db.insert(messages).values({
      ...message,
      sentAt: message.sentAt ? new Date(message.sentAt) : /* @__PURE__ */ new Date()
    }).returning();
    const msg = result[0];
    return {
      ...msg,
      sentAt: msg.sentAt instanceof Date ? msg.sentAt.toISOString() : String(msg.sentAt)
    };
  }
  async getMessageById(id) {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    if (!result[0]) return void 0;
    const msg = result[0];
    return { ...msg, sentAt: msg.sentAt instanceof Date ? msg.sentAt.toISOString() : msg.sentAt };
  }
  async deleteMessage(id) {
    await db.delete(messages).where(eq(messages.id, id));
  }
};

// server/storage.ts
var storage = new DatabaseStorage();

// server/routes.ts
import { z as z2 } from "zod";

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

// server/middleware/cache.ts
function cache(seconds) {
  return (_req, res, next) => {
    res.setHeader("Cache-Control", `public, max-age=${seconds}`);
    next();
  };
}

// server/routes.ts
var insertUserSchema2 = z2.object({
  email: z2.string().email("\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email"),
  username: z2.string().min(3, "\u0406\u043C'\u044F \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430 \u043F\u043E\u0432\u0438\u043D\u043D\u0435 \u043C\u0456\u0441\u0442\u0438\u0442\u0438 \u043C\u0456\u043D\u0456\u043C\u0443\u043C 3 \u0441\u0438\u043C\u0432\u043E\u043B\u0438"),
  password: z2.string().min(6, "\u041F\u0430\u0440\u043E\u043B\u044C \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0431\u0443\u0442\u0438 \u043C\u0456\u043D\u0456\u043C\u0443\u043C 6 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432"),
  firstName: z2.string().min(1, "\u0406\u043C'\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  lastName: z2.string().min(1, "\u041F\u0440\u0456\u0437\u0432\u0438\u0449\u0435 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  userType: z2.enum(["client", "master"])
  // інші поля за потребою
});
var insertReviewSchema2 = z2.object({
  masterId: z2.number().int().positive(),
  rating: z2.number().min(1).max(5),
  comment: z2.string().optional().default(""),
  clientId: z2.number().int().positive(),
  bookingId: z2.number().int().positive(),
  clientName: z2.string().min(1)
});
var insertBookingSchema2 = z2.object({
  description: z2.string().min(1, "\u041E\u043F\u0438\u0441 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  masterId: z2.number().int().positive(),
  serviceId: z2.number().int().positive(),
  clientId: z2.number().int().positive(),
  clientName: z2.string().min(1, "\u0406\u043C'\u044F \u043A\u043B\u0456\u0454\u043D\u0442\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  clientPhone: z2.string().min(1, "\u0422\u0435\u043B\u0435\u0444\u043E\u043D \u043A\u043B\u0456\u0454\u043D\u0442\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  address: z2.string().min(1, "\u0410\u0434\u0440\u0435\u0441\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0430"),
  scheduledDate: z2.string().refine(
    (dateStr) => !isNaN(Date.parse(dateStr)),
    { message: "\u041D\u0435\u0432\u0456\u0440\u043D\u0438\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u0442\u0438" }
  ),
  scheduledTime: z2.string().min(1, "\u0427\u0430\u0441 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  estimatedPrice: z2.string().optional()
});
var profileUpdateSchema = z2.object({
  firstName: z2.string().min(1, "\u0406\u043C'\u044F \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  lastName: z2.string().min(1, "\u041F\u0440\u0456\u0437\u0432\u0438\u0449\u0435 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0435"),
  middleName: z2.string().optional(),
  city: z2.string().optional(),
  birthDate: z2.string().optional(),
  gender: z2.string().optional(),
  about: z2.string().optional(),
  role: z2.enum(["client", "master"]),
  category: z2.string().nullable().optional()
});
var insertServiceSchema2 = z2.object({
  name: z2.string().min(1, "\u041D\u0430\u0437\u0432\u0430 \u043F\u043E\u0441\u043B\u0443\u0433\u0438 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0430"),
  description: z2.string().min(1, "\u041E\u043F\u0438\u0441 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0438\u0439"),
  price: z2.string().min(1, "\u0426\u0456\u043D\u0430 \u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u0430"),
  categoryId: z2.number().int().positive()
});
var insertMessageSchema2 = z2.object({
  bookingId: z2.number().int().positive(),
  receiverId: z2.number().int().positive(),
  text: z2.string().min(1, "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u043C"),
  sentAt: z2.string().optional()
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
      const loginSchema = z2.object({
        email: z2.string().email(),
        password: z2.string().min(1)
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
  app2.get("/api/categories", cache(300), async (req, res) => {
    try {
      const categories = await storage.getAllServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0439" });
    }
  });
  app2.get("/api/categories/:id", cache(300), async (req, res, next) => {
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
  app2.get("/api/masters/:id", cache(300), async (req, res, next) => {
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
  app2.get("/api/masters/:id/reviews", cache(300), async (req, res) => {
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
  app2.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
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
  app2.get("/api/messages/:bookingId", verifyToken, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId, 10);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ID \u0437\u0430\u043A\u0430\u0437\u0430" });
      }
      const messages2 = await storage.getMessagesByBooking(bookingId);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439" });
    }
  });
  app2.post("/api/messages", verifyToken, async (req, res) => {
    try {
      const data = insertMessageSchema2.parse(req.body);
      const message = await storage.createMessage({
        bookingId: data.bookingId,
        receiverId: data.receiverId,
        // <--- ОБЯЗАТЕЛЬНО
        text: data.text,
        senderId: req.user.id,
        sentAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F" });
    }
  });
  app2.delete("/api/messages/:id", verifyToken, async (req, res) => {
    try {
      const messageId = parseInt(req.params.id, 10);
      if (isNaN(messageId)) {
        return res.status(400).json({ message: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ID \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F" });
      }
      const messages2 = await storage.getMessagesByBooking(-1);
      const message = await storage.getMessageById(messageId);
      if (!message) {
        return res.status(404).json({ message: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" });
      }
      if (message.senderId !== req.user.id) {
        return res.status(403).json({ message: "\u041D\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435" });
      }
      await storage.deleteMessage(messageId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F" });
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

// server/viteServer.ts
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createServer2 } from "vite";
import { nanoid } from "nanoid";
import react from "@vitejs/plugin-react";
var __dirname = path.dirname(new URL(import.meta.url).pathname);
async function createViteConfig() {
  const plugins = [react()];
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0) {
    try {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default);
      const cartographer = await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer);
      plugins.push(runtimeErrorOverlay());
      plugins.push(cartographer());
    } catch (err) {
      console.warn("\u26A0 Could not load Replit plugins:", err instanceof Error ? err.message : String(err));
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
        "@assets": path.resolve(rootDir, "attached_assets")
      }
    },
    root: path.resolve(rootDir, "client"),
    build: {
      outDir: path.resolve(rootDir, "dist/public"),
      emptyOutDir: true
    }
  };
}
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
  const viteServer = await createServer2({
    ...await createViteConfig(),
    configFile: false,
    server: {
      middlewareMode: true,
      hmr: { server }
    }
  });
  app2.use(viteServer.middlewares);
  app2.use("*", async (req, res, next) => {
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
      viteServer.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(process.cwd(), "dist/public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(
    express.static(distPath, {
      maxAge: "7d",
      immutable: true
    })
  );
  app2.get("*", (req, res, next) => {
    const filePath = path.join(distPath, req.path);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// server/ws.ts
import { WebSocketServer } from "ws";
import jwt2 from "jsonwebtoken";
var clients = /* @__PURE__ */ new Map();
function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws, req) => {
    const token = new URLSearchParams(req.url?.split("?")[1] || "").get("token");
    if (!token) {
      ws.close();
      return;
    }
    try {
      const decoded = jwt2.verify(token, process.env.JWT_SECRET);
      ws.userId = decoded.id;
      if (!clients.has(ws.userId)) {
        clients.set(ws.userId, /* @__PURE__ */ new Set());
      }
      clients.get(ws.userId).add(ws);
      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data.toString());
          const chatMessage = {
            bookingId: message.bookingId,
            senderId: ws.userId,
            receiverId: message.receiverId,
            text: message.text,
            sentAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          const saved = await storage.createMessage(chatMessage);
          const receivers = clients.get(message.receiverId);
          if (receivers) {
            for (const client of receivers) {
              client.send(JSON.stringify({ type: "message", data: saved }));
            }
          }
          ws.send(JSON.stringify({ type: "ack", data: saved }));
        } catch (err) {
          console.error("WS Message Error:", err);
        }
      });
      ws.on("close", () => {
        if (ws.userId) {
          clients.get(ws.userId)?.delete(ws);
        }
      });
    } catch (err) {
      ws.close();
    }
  });
}

// server/index.ts
var app = express2();
app.set("trust proxy", 1);
var isProd = process.env.NODE_ENV === "production";
app.use(
  helmet({
    contentSecurityPolicy: isProd ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://replit.com"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    } : false
    // Disable CSP in development for Vite
  })
);
if (isProd) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 100,
    message: { message: "\u0417\u0430\u0431\u0430\u0433\u0430\u0442\u043E \u0437\u0430\u043F\u0438\u0442\u0456\u0432, \u0441\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0456\u0437\u043D\u0456\u0448\u0435" }
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 5,
    message: { message: "\u0417\u0430\u0431\u0430\u0433\u0430\u0442\u043E \u0441\u043F\u0440\u043E\u0431 \u0432\u0445\u043E\u0434\u0443, \u0441\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0456\u0437\u043D\u0456\u0448\u0435" }
  });
  app.use("/api/", limiter);
  app.use("/api/auth", authLimiter);
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
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse;
  const originalResJson = res.json;
  res.json = function(body, ...args) {
    capturedJsonResponse = body;
    return originalResJson.apply(res, [body, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse)
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "\u2026";
      log(logLine);
    }
  });
  next();
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
async function testConnection() {
  try {
    const result = await db.query.users.findMany();
    console.log("\u2705 DB connection OK:", result.length, "records");
  } catch (err) {
    console.error("\u274C DB error:", err);
    process.exit(1);
  }
}
(async () => {
  await testConnection();
  await registerRoutes(app);
  const port = Number(process.env.PORT) || 5e3;
  if (isProd) {
    serveStatic(app);
  }
  const server = app.listen(port, "0.0.0.0", () => {
    log(`\u{1F680} Server started on port ${port}`);
  });
  if (!isProd) {
    await setupVite(app, server);
  }
  setupWebSocket(server);
  async function gracefulShutdown() {
    log("\u041E\u0442\u0440\u0438\u043C\u0430\u043D\u043E \u0441\u0438\u0433\u043D\u0430\u043B \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044F, \u0437\u0430\u043A\u0440\u0438\u0432\u0430\u0454\u043C\u043E \u0441\u0435\u0440\u0432\u0435\u0440...");
    if (server) {
      server.close(async () => {
        log("HTTP \u0441\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043A\u0440\u0438\u0442\u043E");
        try {
          if (db && db.$client && typeof db.$client.end === "function") {
            await db.$client.end();
            log("\u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043D\u044F \u0434\u043E \u0411\u0414 \u0437\u0430\u043A\u0440\u0438\u0442\u043E");
          }
        } catch (err) {
          log(
            "\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u043A\u0440\u0438\u0442\u0442\u0456 \u0411\u0414:",
            err instanceof Error ? err.message : String(err)
          );
        }
        log("\u0412\u0438\u0445\u0456\u0434 \u0456\u0437 \u043F\u0440\u043E\u0446\u0435\u0441\u0443");
        process.exit(0);
      });
      setTimeout(() => {
        log("\u041F\u0440\u0438\u043C\u0443\u0441\u043E\u0432\u0438\u0439 \u0432\u0438\u0445\u0456\u0434 \u0447\u0435\u0440\u0435\u0437 \u0442\u0430\u0439\u043C\u0430\u0443\u0442");
        process.exit(1);
      }, 1e4);
    } else {
      process.exit(0);
    }
  }
  process.on("SIGTERM", () => {
    console.log("\u041F\u043E\u043B\u0443\u0447\u0435\u043D SIGTERM");
    gracefulShutdown();
  });
  process.on("SIGINT", () => {
    console.log("\u041F\u043E\u043B\u0443\u0447\u0435\u043D SIGINT");
    gracefulShutdown();
  });
  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    logger.error(message, { stack: err.stack });
  });
})();
