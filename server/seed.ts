import dotenv from 'dotenv';
dotenv.config();

import { db } from "./db";
import { users, masters, serviceCategories, services } from "@shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  // Insert service categories
  const categories = await db.insert(serviceCategories).values([
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
      description: "Ремонт пральних машин, холодільників, плит",
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
  ]).returning();

  console.log(`✅ Created ${categories.length} service categories`);

  // Insert sample users
  const sampleUsers = await db.insert(users).values([
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
  ]).returning();

  console.log(`✅ Created ${sampleUsers.length} sample users`);

  // Insert sample masters
  const sampleMasters = await db.insert(masters).values([
    {
      userId: sampleUsers[0].id,
      specialization: "Сантехнік",
      description: "Професійний сантехнік з 15-річним досвідом роботи. Спеціалізуюся на усуненні протікань, встановленні та ремонті сантехнічного обладнання.",
      experience: "15 років досвіду",
      hourlyRate: "300",
      rating: "5.0",
      reviewCount: 127,
      isVerified: true,
      completedJobs: 1247,
      responseTime: "< 15 хв",
      repeatClients: 94,
    },
    {
      userId: sampleUsers[1].id,
      specialization: "Електрик",
      description: "Сертифікований електрик. Проводка, освітлення, розетки. Гарантія на роботи.",
      experience: "8 років досвіду",
      hourlyRate: "400",
      rating: "4.8",
      reviewCount: 89,
      isVerified: true,
      completedJobs: 456,
      responseTime: "< 20 хв",
      repeatClients: 87,
    },
    {
      userId: sampleUsers[2].id,
      specialization: "Клінінг",
      description: "Професійне прибирання офісів та квартир. Екологічні засоби. Команда до 5 осіб.",
      experience: "6 років досвіду",
      hourlyRate: "200",
      rating: "4.9",
      reviewCount: 156,
      isVerified: true,
      completedJobs: 789,
      responseTime: "< 25 хв",
      repeatClients: 91,
    },
  ]).returning();

  console.log(`✅ Created ${sampleMasters.length} sample masters`);

  // Insert sample services
  const sampleServices = await db.insert(services).values([
    {
      masterId: sampleMasters[0].id,
      categoryId: categories[0].id,
      name: "Усунення протікань",
      description: "Крани, змішувачі, з'єднання труб",
      price: "300",
    },
    {
      masterId: sampleMasters[1].id,
      categoryId: categories[1].id,
      name: "Встановлення розеток",
      description: "Проводка та встановлення електророзеток",
      price: "400",
    },
    {
      masterId: sampleMasters[2].id,
      categoryId: categories[2].id,
      name: "Генеральне прибирання",
      description: "Повне прибирання квартири або офісу",
      price: "200",
    },
  ]).returning();

  console.log(`✅ Created ${sampleServices.length} sample services`);
  console.log("🎉 Database seeding completed!");
}

// Run seeding
seedDatabase()
  .then(() => {
    console.log("Seeding finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });

export { seedDatabase };