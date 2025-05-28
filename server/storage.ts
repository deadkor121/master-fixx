import { 
  users, masters, serviceCategories, services, bookings, reviews,
  type User, type InsertUser,
  type Master, type InsertMaster, type MasterWithUser,
  type ServiceCategory, type InsertServiceCategory,
  type Service, type InsertService,
  type Booking, type InsertBooking, type BookingWithDetails,
  type Review, type InsertReview, type ReviewWithDetails
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Masters
  getMaster(id: number): Promise<Master | undefined>;
  getMasterByUserId(userId: number): Promise<Master | undefined>;
  getMasterWithDetails(id: number): Promise<MasterWithUser | undefined>;
  getAllMasters(): Promise<MasterWithUser[]>;
  getMastersByCategory(categoryId: number): Promise<MasterWithUser[]>;
  createMaster(master: InsertMaster): Promise<Master>;
  updateMasterRating(masterId: number, rating: number, reviewCount: number): Promise<void>;
  
  // Service Categories
  getAllServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Services
  getServicesByMaster(masterId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByMaster(masterId: number): Promise<BookingWithDetails[]>;
  getBookingsByClient(clientId: number): Promise<BookingWithDetails[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<void>;
  
  // Reviews
  getReviewsByMaster(masterId: number): Promise<ReviewWithDetails[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private masters: Map<number, Master>;
  private serviceCategories: Map<number, ServiceCategory>;
  private services: Map<number, Service>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private currentUserId: number;
  private currentMasterId: number;
  private currentCategoryId: number;
  private currentServiceId: number;
  private currentBookingId: number;
  private currentReviewId: number;

  constructor() {
    this.users = new Map();
    this.masters = new Map();
    this.serviceCategories = new Map();
    this.services = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.currentUserId = 1;
    this.currentMasterId = 1;
    this.currentCategoryId = 1;
    this.currentServiceId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize service categories
    const categories: InsertServiceCategory[] = [
      {
        name: "Сантехніка",
        description: "Усунення протікань, встановлення труб, ремонт",
        icon: "fas fa-wrench",
        color: "blue",
        basePrice: "300",
      },
      {
        name: "Електрика",
        description: "Проводка, розетки, освітлення, електромонтаж",
        icon: "fas fa-bolt",
        color: "yellow",
        basePrice: "400",
      },
      {
        name: "Прибирання",
        description: "Генеральне прибирання, після ремонту, регулярне",
        icon: "fas fa-broom",
        color: "green",
        basePrice: "200",
      },
      {
        name: "Ремонт",
        description: "Оздоблювальні роботи, фарбування, плитка",
        icon: "fas fa-paint-roller",
        color: "purple",
        basePrice: "500",
      },
      {
        name: "Побутова техніка",
        description: "Ремонт пральних машин, холодильників, плит",
        icon: "fas fa-cog",
        color: "red",
        basePrice: "350",
      },
      {
        name: "Меблі",
        description: "Збирання, ремонт, перетяжка меблів",
        icon: "fas fa-couch",
        color: "indigo",
        basePrice: "250",
      },
    ];

    categories.forEach(cat => this.createServiceCategory(cat));

    // Initialize sample masters
    const sampleUsers: InsertUser[] = [
      {
        username: "oleksandr_plumber",
        email: "oleksandr@example.com",
        password: "hashedpassword1",
        firstName: "Олександр",
        lastName: "Петренко",
        phone: "+380671234567",
        userType: "master",
      },
      {
        username: "maria_electrician",
        email: "maria@example.com",
        password: "hashedpassword2",
        firstName: "Марія",
        lastName: "Іваненко",
        phone: "+380671234568",
        userType: "master",
      },
      {
        username: "ivan_cleaner",
        email: "ivan@example.com",
        password: "hashedpassword3",
        firstName: "Іван",
        lastName: "Коваленко",
        phone: "+380671234569",
        userType: "master",
      },
    ];

    const createdUsers = sampleUsers.map(user => this.createUser(user));

    Promise.all(createdUsers).then(users => {
      const sampleMasters: InsertMaster[] = [
        {
          userId: users[0].id,
          specialization: "Сантехнік",
          description: "Професійний сантехнік з 15-річним досвідом роботи. Спеціалізуюся на усуненні протікань, встановленні та ремонті сантехнічного обладнання.",
          experience: "15 років досвіду",
          hourlyRate: "300",
          isVerified: true,
          responseTime: "< 15 хв",
        },
        {
          userId: users[1].id,
          specialization: "Електрик",
          description: "Сертифікований електрик. Проводка, освітлення, розетки. Гарантія на роботи.",
          experience: "8 років досвіду",
          hourlyRate: "400",
          isVerified: true,
          responseTime: "< 20 хв",
        },
        {
          userId: users[2].id,
          specialization: "Клінінг",
          description: "Професійне прибирання офісів та квартир. Екологічні засоби. Команда до 5 осіб.",
          experience: "6 років досвіду",
          hourlyRate: "200",
          isVerified: true,
          responseTime: "< 25 хв",
        },
      ];

      sampleMasters.forEach(master => this.createMaster(master));
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      phone: insertUser.phone || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Masters
  async getMaster(id: number): Promise<Master | undefined> {
    return this.masters.get(id);
  }

  async getMasterByUserId(userId: number): Promise<Master | undefined> {
    return Array.from(this.masters.values()).find(master => master.userId === userId);
  }

  async getMasterWithDetails(id: number): Promise<MasterWithUser | undefined> {
    const master = this.masters.get(id);
    if (!master) return undefined;

    const user = this.users.get(master.userId);
    if (!user) return undefined;

    const services = await this.getServicesByMaster(id);
    const category = services.length > 0 ? 
      this.serviceCategories.get(services[0].categoryId) : 
      Array.from(this.serviceCategories.values())[0];

    return {
      ...master,
      user,
      services,
      category: category!,
    };
  }

  async getAllMasters(): Promise<MasterWithUser[]> {
    const masters = Array.from(this.masters.values());
    const mastersWithDetails = await Promise.all(
      masters.map(async master => {
        const user = this.users.get(master.userId);
        const services = await this.getServicesByMaster(master.id);
        const category = services.length > 0 ? 
          this.serviceCategories.get(services[0].categoryId) : 
          Array.from(this.serviceCategories.values())[0];

        return {
          ...master,
          user: user!,
          services,
          category: category!,
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

  async createMaster(insertMaster: InsertMaster): Promise<Master> {
    const id = this.currentMasterId++;
    const master: Master = {
      id,
      userId: insertMaster.userId,
      specialization: insertMaster.specialization,
      description: insertMaster.description,
      experience: insertMaster.experience,
      hourlyRate: insertMaster.hourlyRate,
      rating: "5.0",
      reviewCount: 50,
      isVerified: insertMaster.isVerified || false,
      avatar: insertMaster.avatar || null,
      completedJobs: 250,
      responseTime: insertMaster.responseTime || "< 30 хв",
      repeatClients: 85,
    };
    this.masters.set(id, master);
    return master;
  }

  async updateMasterRating(masterId: number, rating: number, reviewCount: number): Promise<void> {
    const master = this.masters.get(masterId);
    if (master) {
      master.rating = rating.toString();
      master.reviewCount = reviewCount;
      this.masters.set(masterId, master);
    }
  }

  // Service Categories
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }

  async createServiceCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.currentCategoryId++;
    const category: ServiceCategory = { ...insertCategory, id };
    this.serviceCategories.set(id, category);
    return category;
  }

  // Services
  async getServicesByMaster(masterId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.masterId === masterId);
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  // Bookings
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByMaster(masterId: number): Promise<BookingWithDetails[]> {
    const bookings = Array.from(this.bookings.values()).filter(booking => booking.masterId === masterId);
    return this.enrichBookings(bookings);
  }

  async getBookingsByClient(clientId: number): Promise<BookingWithDetails[]> {
    const bookings = Array.from(this.bookings.values()).filter(booking => booking.clientId === clientId);
    return this.enrichBookings(bookings);
  }

  private async enrichBookings(bookings: Booking[]): Promise<BookingWithDetails[]> {
    return Promise.all(
      bookings.map(async booking => {
        const master = await this.getMasterWithDetails(booking.masterId);
        const service = this.services.get(booking.serviceId);
        const client = this.users.get(booking.clientId);

        return {
          ...booking,
          master: master!,
          service: service!,
          client: client!,
        };
      })
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = {
      ...insertBooking,
      id,
      status: "pending",
      estimatedPrice: insertBooking.estimatedPrice || null,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string): Promise<void> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
  }

  // Reviews
  async getReviewsByMaster(masterId: number): Promise<ReviewWithDetails[]> {
    const reviews = Array.from(this.reviews.values()).filter(review => review.masterId === masterId);
    return Promise.all(
      reviews.map(async review => {
        const master = this.masters.get(review.masterId);
        const client = this.users.get(review.clientId);

        return {
          ...review,
          master: master!,
          client: client!,
        };
      })
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);

    // Update master rating
    const masterReviews = await this.getReviewsByMaster(insertReview.masterId);
    const avgRating = masterReviews.reduce((sum, r) => sum + r.rating, 0) / masterReviews.length;
    await this.updateMasterRating(insertReview.masterId, avgRating, masterReviews.length);

    return review;
  }
}

export const storage = new MemStorage();
