import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(), // 'client' or 'master'
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  middleName: text("middle_name"),
  city: text("city"),           // <--- добавить
  birthDate: text("birth_date"),// <--- добавить (или date, если используете date)
  gender: text("gender"),       // <--- добавить
  about: text("about"),         // <--- добавить
 
});

export const masters = pgTable("masters", {
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
  responseTime: text("response_time").default("< 30 хв"),
  repeatClients: integer("repeat_clients").default(0),
});

export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  masterId: integer("master_id").notNull(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const bookings = pgTable("bookings", {
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
  status: text("status").default("pending"), // 'pending', 'confirmed', 'completed', 'cancelled'
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  masterId: integer("master_id").notNull(),

  clientId: integer("client_id").notNull(),
  bookingId: integer("booking_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  clientName: text("client_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  senderId: integer("sender_id").notNull(),
    receiverId: integer("receiver_id").notNull().default(0),
  text: text("text").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull(),
});


export const insertMessageSchema = z.object({
  bookingId: z.number(),
  receiverId: z.number(),
  text: z.string().min(1),
   sentAt: z.string().optional(), 
});


// Insert schemas

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}as const);

export const insertMasterSchema = createInsertSchema(masters).omit({
  id: true,
  rating: true,
  reviewCount: true,
  completedJobs: true,
  repeatClients: true,
} as const);



export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Master = typeof masters.$inferSelect;
export type InsertMaster = z.infer<typeof insertMasterSchema>;

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = Omit<Message, "id">;

// Extended types for frontend
export type PublicUser = Omit<User, "password">;
export type MasterWithUser = Master & {
  user: PublicUser;
  services: Service[];
  category: ServiceCategory;
  clientsCount?: number; 
};

export type BookingWithDetails = Booking & {
  master: MasterWithUser;
  service: Service;
  client: User;
};

export type ReviewWithDetails = Review & {
  master: Master;
  client: User;
  name?: string;
  text?: string;
  date?: string;
};

export type ChatMessage = {
  id: number;
  bookingId: number;
  senderId: number;
  receiverId: number; 
  text: string;
  sentAt: string; // всегда строка ISO
  senderName?: string; // новое поле
};