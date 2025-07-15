import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, masters, serviceCategories, services, bookings, reviews,
  type User, type InsertUser,
  type Master, type InsertMaster, type MasterWithUser,
  type ServiceCategory, type InsertServiceCategory,
  type Service, type InsertService,
  type Booking, type InsertBooking, type BookingWithDetails,
  type Review, type InsertReview, type ReviewWithDetails
} from "@shared/schema";
import type { IStorage } from "./storage";
import { messages, type Message } from "@shared/schema";

export type ChatMessage = {
  id: number;
  bookingId: number;
  senderId: number;
  receiverId: number;
  text: string;
  sentAt: string; // всегда строка ISO
};

export type InsertChatMessage = Omit<ChatMessage, "id">;

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values({ ...user, category: user.category ?? null }).returning();
    return result[0];
  }

 
  async updateUserProfile(
    userId: number,
    data: {
      firstName: string;
      lastName: string;
      middleName?: string | null;
      city?: string | null;
      birthDate?: string | null;
      gender?: string | null;
      about?: string | null;
      category?: string | null;
    }
  ): Promise<User> {
    const result = await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName ?? null,
        city: data.city ?? null,
        birthDate: data.birthDate ?? null,
        gender: data.gender ?? null,
        about: data.about ?? null,
        category: data.category ?? null,
      })
      .where(eq(users.id, userId))
      .returning();
  
    return result[0] as User;
  }
  async updateMasterProfile(
    userId: number,
    data: {
      specialization: string;
    
    }
  ): Promise<Master> {
    const result = await db
      .update(masters)
      .set({
        specialization: data.specialization,
      
      })
      .where(eq(masters.userId, userId))
      .returning();
    return result[0] as Master;
  }
  // Masters
  async getMaster(id: number): Promise<Master | undefined> {
    const result = await db.select().from(masters).where(eq(masters.id, id));
    return result[0];
  }

  async getMasterByUserId(userId: number): Promise<Master | undefined> {
    const result = await db.select().from(masters).where(eq(masters.userId, userId));
    return result[0];
  }

  async getMasterWithDetails(id: number): Promise<MasterWithUser | undefined> {
    const masterResult = await db
      .select({
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
          city: users.city,
        },
      })
      .from(masters)
      .innerJoin(users, eq(masters.userId, users.id))
      .where(eq(masters.id, id));
  
    if (!masterResult[0]) return undefined;
  
    const masterServices = await this.getServicesByMaster(id);
    const categoriesResult = await db.select().from(serviceCategories);
    const category =
      categoriesResult[0] ||
      {
        id: 1,
        name: "Загальні",
        description: "",
        icon: "",
        color: "blue",
        basePrice: "300",
      };
  
    return {
      ...masterResult[0].master,
      user: masterResult[0].user,
      services: masterServices,
      category,
    };
  }
  async getAllMasters(): Promise<MasterWithUser[]> {
    const mastersResult = await db
      .select({
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
          city: users.city,
          // password: users.password, // НЕ добавляйте password!
        },
      })
      .from(masters)
      .innerJoin(users, eq(masters.userId, users.id));
  
    const categoriesResult = await db.select().from(serviceCategories);
    const category = categoriesResult[0] || { id: 1, name: "Загальні", description: "", icon: "", color: "blue", basePrice: "300" };
  
    const mastersWithDetails = await Promise.all(
      mastersResult.map(async (result) => {
        const masterServices = await this.getServicesByMaster(result.master.id);
        return {
          ...result.master,
          user: result.user, // это PublicUser
          services: masterServices,
          category,
        };
      })
    );
  
    return mastersWithDetails;
  }
  async getMastersByCategory(categoryId: number): Promise<MasterWithUser[]> {
    const allMasters = await this.getAllMasters();
    return allMasters.filter(master => 
      master.services.some(service => service.categoryId === categoryId)
    );
  }

  async createMaster(master: InsertMaster): Promise<Master> {
    const result = await db.insert(masters).values(master).returning();
    return result[0];
  }

  async updateMasterRating(masterId: number, rating: number, reviewCount: number): Promise<void> {
    await db
      .update(masters)
      .set({ rating: rating.toString(), reviewCount })
      .where(eq(masters.id, masterId));
  }

  // Service Categories
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    const result = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return result[0];
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const result = await db.insert(serviceCategories).values(category).returning();
    return result[0];
  }

  // Services
  async getServicesByMaster(masterId: number): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.masterId, masterId));
  }

  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }


  async updateService(serviceId: number, data: Partial<InsertService>): Promise<Service> {
    const result = await db
      .update(services)
      .set(data)
      .where(eq(services.id, serviceId))
      .returning();
    return result[0];
  }

  async deleteService(serviceId: number): Promise<void> {
    await db.delete(services).where(eq(services.id, serviceId));
  }

  // Bookings
  async getBooking(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id));
    return result[0];
  }

  async getBookingsByMaster(masterId: number): Promise<BookingWithDetails[]> {
    const bookingsResult = await db.select().from(bookings).where(eq(bookings.masterId, masterId));
    return this.enrichBookings(bookingsResult);
  }

  async getBookingsByClient(clientId: number): Promise<BookingWithDetails[]> {
    const bookingsResult = await db.select().from(bookings).where(eq(bookings.clientId, clientId));
    return this.enrichBookings(bookingsResult);
  }

  private async enrichBookings(bookingsList: Booking[]): Promise<BookingWithDetails[]> {
    return Promise.all(
      bookingsList.map(async (booking) => {
        const master = await this.getMasterWithDetails(booking.masterId);
        const service = await this.getService(booking.serviceId);
        const client = await this.getUser(booking.clientId);

        return {
          ...booking,
          master: master!,
          service: service!,
          client: client!,
        };
      })
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  async updateBookingStatus(id: number, status: string): Promise<void> {
    await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id));
  }

  // Reviews
  async getReviewsByMaster(masterId: number): Promise<ReviewWithDetails[]> {
    const reviewsResult = await db.select().from(reviews).where(eq(reviews.masterId, masterId));
    
    return Promise.all(
      reviewsResult.map(async (review) => {
        const master = await this.getMaster(review.masterId);
        const client = await this.getUser(review.clientId);

        return {
          ...review,
          master: master!,
          client: client!,
        };
      })
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();

    // Update master rating
    const masterReviews = await this.getReviewsByMaster(review.masterId);
    const avgRating = masterReviews.reduce((sum, r) => sum + r.rating, 0) / masterReviews.length;
    await this.updateMasterRating(review.masterId, avgRating, masterReviews.length);

    return result[0];
  }

  // Messages
  async getMessagesByBooking(bookingId: number): Promise<ChatMessage[]> {
    // Делаем join с users, чтобы получить имя отправителя
   const result = await db
  .select({
    id: messages.id,
    bookingId: messages.bookingId,
    senderId: messages.senderId,
    receiverId: messages.receiverId, // ← ДОДАЙ ЦЕ
    text: messages.text,
    sentAt: messages.sentAt,
    senderName: users.firstName,
  })
  .from(messages)
  .leftJoin(users, eq(messages.senderId, users.id))
  .where(eq(messages.bookingId, bookingId));

    return result.map(msg => ({
      ...msg,
      sentAt: msg.sentAt instanceof Date ? msg.sentAt.toISOString() : String(msg.sentAt),
      senderName: msg.senderName,
    }));
  }

  async createMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(messages)
      .values({
        ...message,
        sentAt: message.sentAt ? new Date(message.sentAt) : new Date(),
      })
      .returning();
    const msg = result[0];
    return {
      ...msg,
      sentAt: msg.sentAt instanceof Date ? msg.sentAt.toISOString() : String(msg.sentAt),
    };
  }

  async getMessageById(id: number): Promise<ChatMessage | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    if (!result[0]) return undefined;
    const msg = result[0];
    return { ...msg, sentAt: msg.sentAt instanceof Date ? msg.sentAt.toISOString() : msg.sentAt };
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }
}