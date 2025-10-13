import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, text, double } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const products = mysqlTable("products", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text().default('NULL'),
	price: double().notNull(),
	imageUrl: varchar("image_url", { length: 512 }).default('NULL'),
});
