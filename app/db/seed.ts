import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "./schema.js";

// ---------- CATEGORY IMAGE SEEDS (STABLE) ----------
const imageSeeds: Record<string, string[]> = {
  electronics: ["electronics", "tech", "gadget", "devices"],
  clothing: ["clothes", "fashion", "tshirt", "outfit"],
  home: ["furniture", "interior", "home-decor", "appliances"],
  sports: ["sports", "fitness", "running", "training"],
  books: ["books", "library", "reading"],
  beauty: ["beauty", "cosmetics", "skincare"],
  gaming: ["gaming", "console", "pc-gaming", "esports"],
};

// ---------- PRODUCT GENERATOR ----------
function generateProducts(count: number) {
  const categories = [
    "electronics", "clothing", "home", "sports", "books", "beauty"
  ];

  const productTemplates = [
    { name: "Wireless", base: ["Mouse", "Keyboard", "Headphones", "Charger", "Speaker"] },
    { name: "Premium", base: ["Watch", "Backpack", "Sunglasses", "Pen", "Notebook"] },
    { name: "Ergonomic", base: ["Chair", "Desk", "Mouse Pad", "Monitor Stand"] },
    { name: "Smart", base: ["TV", "Light Bulb", "Thermostat", "Plug", "Scale"] },
    { name: "Gaming", base: ["Controller", "Headset", "Mouse", "Keyboard", "Chair"] },
  ];

  const generatedProducts = [];

  for (let i = 0; i < count; i++) {
    const template = productTemplates[Math.floor(Math.random() * productTemplates.length)];
    const baseProduct = template.base[Math.floor(Math.random() * template.base.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const name = `${template.name} ${baseProduct}`;
    const price = (Math.random() * 200 + 10).toFixed(2);
    const stock = Math.floor(Math.random() * 50);

    // ---------- SMART IMAGE SELECTION ----------
    const categoryKey =
      template.name.toLowerCase().includes("gaming") ? "gaming" : category;
    const seeds = imageSeeds[categoryKey] || imageSeeds["electronics"];
    const seed = seeds[i % seeds.length]; // rotate among related seeds

    // Picsum will generate stable images for each seed
    const imageUrl = `https://picsum.photos/seed/${categoryKey}-${seed}-${i}/400/300`;

    generatedProducts.push({
      name,
      description: `High-quality ${name.toLowerCase()} for everyday use. Features premium materials and excellent performance.`,
      price: parseFloat(price),
      imageUrl,
      stock,
    });
  }

  return generatedProducts;
}

// ---------- SEED FUNCTION ----------
async function seed() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: undefined,
    database: "product_catalog",
  });

  const db = drizzle(connection);

  // Clear existing rows
  await db.delete(products);

  // Generate and insert 50 products
  const seedProducts = generateProducts(50);
  await db.insert(products).values(seedProducts);

  console.log("✅ 50 products seeded successfully!");
  await connection.end();
}

seed().catch(console.error);
