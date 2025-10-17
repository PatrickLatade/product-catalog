import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "./schema.js";
import fs from "fs";
import path from "path";

// ---------- BUILD IMAGE MAP (GROUP VARIANTS) ----------
function buildImageMap() {
  const imageDir = path.resolve(process.cwd(), "public/images");
  const files = fs.readdirSync(imageDir);

  const map: Record<string, string[]> = {};
  for (const file of files) {
    const baseName = path.basename(file, path.extname(file)).toLowerCase();
    const key = baseName.replace(/-\d+$/, ""); // group variants like 'smart-thermostat-1'
    if (!map[key]) map[key] = [];
    map[key].push(`/images/${file}`);
  }

  console.log("🗺️ Loaded image groups:", Object.keys(map));
  return map;
}

// ---------- TEMPLATE ALIAS MAP ----------
const templateAliases: Record<string, string[]> = {
  premium: ["smart", "wireless"],
  ergonomic: ["chair", "desk"],
  wireless: ["tech", "smart"],
  smart: ["premium", "wireless"],
  gaming: ["ergonomic"],
};

// ---------- PRODUCT GENERATOR ----------
function generateProducts(targetCount = 50) {
  const imageMap = buildImageMap();

  const productTemplates = [
    { name: "Wireless", base: ["Mouse", "Keyboard", "Headphones", "Charger", "Speaker"] },
    { name: "Premium", base: ["Watch", "Backpack", "Sunglasses", "Pen", "Notebook", "Thermostat"] },
    { name: "Ergonomic", base: ["Chair", "Desk", "Mouse Pad", "Monitor Stand"] },
    { name: "Smart", base: ["TV", "Light Bulb", "Thermostat", "Plug", "Scale"] },
    { name: "Gaming", base: ["Controller", "Headset", "Mouse", "Keyboard", "Chair"] },
  ];

  const generatedProducts = [];

  // Generate base set first (covers all unique template+base combos)
  for (const template of productTemplates) {
    for (const baseProduct of template.base) {
      const name = `${template.name} ${baseProduct}`;
      generatedProducts.push(createProduct(name, template.name, baseProduct, imageMap));
    }
  }

  // If we need more, add duplicates (with different images) but keep same name
  while (generatedProducts.length < targetCount) {
    const template = productTemplates[Math.floor(Math.random() * productTemplates.length)];
    const baseProduct = template.base[Math.floor(Math.random() * template.base.length)];
    const name = `${template.name} ${baseProduct}`; // no suffix number
    generatedProducts.push(createProduct(name, template.name, baseProduct, imageMap));
  }

  return generatedProducts.slice(0, targetCount); // ensure exactly 50
}

// ---------- CREATE PRODUCT HELPER ----------
function createProduct(
  name: string,
  templateName: string,
  baseProduct: string,
  imageMap: Record<string, string[]>
) {
  const baseKey = baseProduct.toLowerCase().replace(/[\s_]/g, "-");
  const templateKey = templateName.toLowerCase().replace(/[\s_]/g, "-");

  // ---------- SMART PRIORITIZED MATCH ----------
  let matchedKey: string | undefined;

  // 1️⃣ Exact "template-base"
  if (imageMap[`${templateKey}-${baseKey}`]) {
    matchedKey = `${templateKey}-${baseKey}`;
  }
  // 2️⃣ Base only
  else if (imageMap[baseKey]) {
    matchedKey = baseKey;
  }
  // 3️⃣ Aliases
  else if (templateAliases[templateKey]) {
    for (const alias of templateAliases[templateKey]) {
      if (imageMap[`${alias}-${baseKey}`]) {
        matchedKey = `${alias}-${baseKey}`;
        break;
      }
    }
  }
  // 4️⃣ Compound fuzzy
  if (!matchedKey) {
    matchedKey = Object.keys(imageMap).find(
      (key) => key.includes(baseKey) && key.includes(templateKey)
    );
  }

  // 5️⃣ Default fallback
  const imageGroup = matchedKey ? imageMap[matchedKey] : imageMap["default"];
  const imageUrl =
    imageGroup && imageGroup.length > 0
      ? imageGroup[Math.floor(Math.random() * imageGroup.length)] // pick random variant
      : "/images/default.jpg";

  const price = parseFloat((Math.random() * 200 + 10).toFixed(2));
  const stock = Math.floor(Math.random() * 50) + 5;

  console.log(`✅ ${name.padEnd(25)} → ${matchedKey || "default"} (${imageUrl})`);

  return {
    name,
    description: `High-quality ${name.toLowerCase()} for everyday use. Built for durability and performance.`,
    price,
    imageUrl,
    stock,
  };
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

  await db.delete(products);
  const seedProducts = generateProducts(50);
  await db.insert(products).values(seedProducts);

  console.log(`🌱 ${seedProducts.length} products seeded successfully with randomized image variants (no numbered names)!`);
  await connection.end();
}

seed().catch(console.error);
