import { useLoaderData, useNavigation, useActionData } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProductTable } from "app/components/admin/ProductTable";
import { AddProductModal } from "app/components/admin/AddProductModal";
import { EditProductModal } from "app/components/admin/EditProductModal";
import { DeleteProductModal } from "app/components/admin/DeleteProductModal";
import { Toast } from "app/components/admin/Toast";
import type { Product } from "app/types/Product";
import { db } from "app/db/client"; // or wherever your drizzle/db setup is
import { products } from "app/db/schema";
// app/routes/admin.tsx
import { adminAction } from "app/types/adminAction";

export const action = adminAction;

export async function loader() {
  const productList = await db.select().from(products);
  return new Response(
    JSON.stringify(productList ?? []),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export default function Admin() {
  const productList = useLoaderData();
  const navigation = useNavigation();
  const actionData = useActionData();
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      setToast({ message: actionData.success, type: "success" });
      ["add_modal", "edit_modal", "delete_modal"].forEach((id) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.checked = false;
      });
      setEditing(null);
      setDeleting(null);
    } else if (actionData?.error) {
      setToast({ message: actionData.error, type: "error" });
    }
  }, [actionData]);

  return (
    <main className="p-8 space-y-6 relative">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <Toast toast={toast} />
      <label htmlFor="add_modal" className="btn btn-primary">
        + Add Product
      </label>
      <ProductTable
        products={productList}
        onEdit={(p) => setEditing(p)}
        onDelete={(p) => setDeleting(p)}
      />
      <AddProductModal isSubmitting={isSubmitting} error={actionData?.error} />
      {editing && (
        <EditProductModal
          editing={editing}
          setEditing={setEditing}
          isSubmitting={isSubmitting}
          isClosing={isClosing}
          setIsClosing={setIsClosing}
        />
      )}
      {deleting && <DeleteProductModal deleting={deleting} setDeleting={setDeleting} />}
    </main>
  );
}
