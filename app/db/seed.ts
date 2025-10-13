import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "./schema.js";

async function seed() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: undefined, // or your DB password if set
    database: "product_catalog",
  });
  const db = drizzle(connection);

  // Clear existing rows (optional — only if you want a fresh start)
  await db.delete(products);

  // Insert new seed data with stock values
  await db.insert(products).values([
    {
      name: "Wireless Mouse",
      description: "Smooth ergonomic mouse for everyday use.",
      price: 25.99,
      imageUrl: "/images/mouse.jpg",
      stock: 12,
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB backlit keyboard with tactile switches.",
      price: 79.99,
      imageUrl: "/images/keyboard.jpg",
      stock: 5,
    },
    {
      name: "Gaming Headset",
      description: "Surround sound headset with mic.",
      price: 59.99,
      imageUrl: "/images/headset.jpg",
      stock: 0, // example of out-of-stock
    },
  ]);

  console.log("✅ Seed data inserted.");
  await connection.end();
}

seed();
