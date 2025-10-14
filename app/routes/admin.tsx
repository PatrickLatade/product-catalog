import { useLoaderData, useNavigation, useActionData } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProductTable } from "app/components/admin/ProductTable";
import { AddProductModal } from "app/components/admin/AddProductModal";
import { EditProductModal } from "app/components/admin/EditProductModal";
import { DeleteProductModal } from "app/components/admin/DeleteProductModal";
import { Toast } from "app/components/admin/Toast";
import type { Product } from "app/types/Product";
import { db } from "app/db/client";
import { products } from "app/db/schema";
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
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      // Determine toast type based on the success message
      let toastType: "success" | "warning" | "error" = "success";
      
      if (actionData.success.includes("added")) {
        toastType = "success"; // Green for add
      } else if (actionData.success.includes("updated")) {
        toastType = "warning"; // Yellow for edit
      } else if (actionData.success.includes("deleted")) {
        toastType = "error"; // Red for delete
      }
      
      setToast({ message: actionData.success, type: toastType });
      setIsExiting(false);
      
      // Start exit animation after 2.7s
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 2700);
      
      // Remove message after animation completes
      const hideTimer = setTimeout(() => {
        setToast(null);
      }, 3000);

      ["add_modal", "edit_modal", "delete_modal"].forEach((id) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.checked = false;
      });
      setEditing(null);
      setDeleting(null);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(hideTimer);
      };
    } else if (actionData?.error) {
      setToast({ message: actionData.error, type: "error" });
      setIsExiting(false);
    }
  }, [actionData]);

  return (
    <main className="p-8 space-y-6 relative">
      <Toast toast={toast} isExiting={isExiting} />
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
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