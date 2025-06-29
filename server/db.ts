import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

const useSSL = process.env.DB_SSL === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL
    ? {
        rejectUnauthorized: false, // отключает проверку сертификата (для dev или managed БД)
      }
    : false,
});

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const db = drizzle(pool, { schema });
console.log('Drizzle ORM initialized with schema:', Object.keys(schema).join(', '));