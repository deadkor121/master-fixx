"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var node_postgres_1 = require("drizzle-orm/node-postgres");
var pg_1 = require("pg");
var schema = require("@shared/schema");
var useSSL = process.env.DB_SSL === 'true';
var pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL
        ? {
            rejectUnauthorized: false, // отключает проверку сертификата (для dev или managed БД)
        }
        : false,
});
console.log('DATABASE_URL:', process.env.DATABASE_URL);
exports.db = (0, node_postgres_1.drizzle)(pool, { schema: schema });
console.log('Drizzle ORM initialized with schema:', Object.keys(schema).join(', '));
