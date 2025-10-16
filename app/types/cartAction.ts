import { db } from "app/db/client";
import { products } from "app/db/schema";
import { eq } from "drizzle-orm";
import type { ActionFunction } from "react-router-dom";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent !== "checkout") return { error: "Invalid intent" };

  const cartJson = formData.get("cart");
  if (!cartJson) return { error: "No cart items sent" };

  const cartItems = JSON.parse(cartJson as string) as { id: number; quantity: number }[];

  const purchasedItems: { id: number; name: string; price: number; quantity: number }[] = [];
  let total = 0;

  try {
    for (const item of cartItems) {
      const [product] = await db.select().from(products).where(eq(products.id, item.id));
      if (!product) continue;

      const newStock = Math.max(product.stock - item.quantity, 0);
      await db.update(products).set({ stock: newStock }).where(eq(products.id, item.id));

      purchasedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      total += product.price * item.quantity;
    }

    // Return data instead of redirect
    return { success: true, items: purchasedItems, total };
  } catch (err) {
    console.error(err);
    return { error: "Checkout failed." };
  }
};
