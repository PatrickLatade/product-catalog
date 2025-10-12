import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema.ts",   // where you’ll define tables
  out: "./drizzle",               // where migration files go
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: undefined,
    database: "product_catalog",
  },
});
