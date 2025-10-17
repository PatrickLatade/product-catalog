// app/routes/api.products.ts
import { db } from "app/db/client";
import { products } from "app/db/schema";

// ✅ Return only id + stock to keep it lightweight
export async function loader() {
  const result = await db
    .select({
      id: products.id,
      stock: products.stock,
    })
    .from(products);

  return Response.json(result);
}
