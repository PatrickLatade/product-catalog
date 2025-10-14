// app/actions/adminAction.ts
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { eq } from "drizzle-orm";
import type { ActionFunction } from "react-router";
import fs from "fs/promises";
import path from "path";

export const adminAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action")?.toString();
  const intent = formData.get("intent")?.toString(); // <- for stock adjustments

  const name = formData.get("name")?.toString() || "";
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const stock = parseInt(formData.get("stock")?.toString() || "0");
  const description = formData.get("description")?.toString() || "";
  const image = formData.get("image");

  try {
    // Handle image upload
    let imageUrl = "";
    if (image && image instanceof File && image.size > 0) {
      const filename = `${Date.now()}-${image.name}`;
      const filePath = path.join(process.cwd(), "public", "images", filename);

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      imageUrl = `/images/${filename}`;
    }

    // ---------- Normal actions ----------
    if (_action === "create") {
      await db.insert(products).values({
        name,
        price,
        stock,
        description,
        imageUrl,
      });
      return { success: "Product added successfully!" };
    }

    if (_action === "edit") {
      const id = parseInt(formData.get("id")?.toString() || "0");
      if (!id) throw new Error("Missing product ID for edit");

      await db.update(products)
        .set({
          name,
          price,
          stock,
          description,
          ...(imageUrl ? { imageUrl } : {}),
        })
        .where(eq(products.id, id));

      return { success: "Product updated successfully!" };
    }

    if (_action === "delete") {
      const id = parseInt(formData.get("id")?.toString() || "0");
      if (!id) throw new Error("Missing product ID for delete");

      await db.delete(products).where(eq(products.id, id));
      return { success: "Product deleted successfully!" };
    }

    // ---------- Stock adjustment ----------
    if (intent === "adjust_stock") {
      const id = parseInt(formData.get("id")?.toString() || "0");
      if (!id) throw new Error("Missing product ID for stock adjustment");

      await db.update(products).set({ stock }).where(eq(products.id, id));
      return { success: "Stock adjusted successfully!" };
    }

    throw new Error("Unknown action or intent");
  } catch (err: any) {
    return { error: err.message || "Something went wrong" };
  }
};
