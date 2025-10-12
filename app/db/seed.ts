import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "./schema.js";

async function seed() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: undefined,
    database: "product_catalog",
  });
  const db = drizzle(connection);

  await db.insert(products).values([
    {
      name: "Wireless Mouse",
      description: "Smooth ergonomic mouse for everyday use.",
      price: 25.99,
      imageUrl: "/images/mouse.jpg",
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB backlit keyboard with tactile switches.",
      price: 79.99,
      imageUrl: "/images/keyboard.jpg",
    },
    {
      name: "Gaming Headset",
      description: "Surround sound headset with mic.",
      price: 59.99,
      imageUrl: "/images/headset.jpg",
    },
  ]);

  console.log("✅ Seed data inserted.");
  await connection.end();
}

seed();
