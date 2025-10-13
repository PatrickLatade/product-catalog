import { mysqlTable, int, varchar, text, double } from "drizzle-orm/mysql-core";

export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: double("price").notNull(),
  imageUrl: varchar("image_url", { length: 512 }),
  stock: int("stock").notNull().default(0),
});
