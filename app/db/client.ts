import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

// Create a pooled connection to MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: undefined, // Be sure to set a secure password for production!
  database: "product_catalog",
});

// Export reusable Drizzle instance
// FIX: The drizzle function for mysql2 driver requires the 'mode' property 
// in the configuration object when passing a schema. The typical mode when 
// using a standard mysql2 connection pool is 'planetscale'.
export const db = drizzle(pool, { schema, mode: "planetscale" });