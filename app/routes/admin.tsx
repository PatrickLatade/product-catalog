import { useLoaderData, useNavigation, useActionData } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "app/components/Navbar";
import { ProductTable } from "app/components/admin/ProductTable";
import { AddProductModal } from "app/components/admin/AddProductModal";
import { EditProductModal } from "app/components/admin/EditProductModal";
import { DeleteProductModal } from "app/components/admin/DeleteProductModal";
import { Toast } from "app/components/admin/Toast";
import type { Product } from "app/types/Product";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { adminAction } from "app/types/adminAction";
import { motion } from "framer-motion";

export const action = adminAction;

export async function loader() {
  const productList = await db.select().from(products);
  return productList ?? [];
}

export default function Admin() {
  const productList = useLoaderData() as Product[];
  const navigation = useNavigation();
  const actionData = useActionData() as any;
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: "success" | "warning" | "error" }[]
  >([]);
  const [isClosing, setIsClosing] = useState(false);
  const isSubmitting = navigation.state === "submitting";

  // --- Toast handler ---
  useEffect(() => {
    if (actionData?.success) {
      // Determine toast type
      let toastType: "success" | "warning" | "error" = "success";
      if (actionData.success.includes("added")) toastType = "success";
      else if (actionData.success.includes("updated")) toastType = "warning";
      else if (actionData.success.includes("deleted")) toastType = "error";

      // Create a new toast
      const newToast = {
        id: crypto.randomUUID(),
        message: actionData.success,
        type: toastType,
      };

      // Add it to the stack
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);

      // Close any open modals
      ["add_modal", "edit_modal", "delete_modal"].forEach((id) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.checked = false;
      });
      setEditing(null);
      setDeleting(null);
    } else if (actionData?.error) {
      const errorToast = {
        id: crypto.randomUUID(),
        message: actionData.error,
        type: "error" as const,
      };

      setToasts((prev) => [...prev, errorToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== errorToast.id));
      }, 3000);
    }
  }, [actionData]);

  return (
    <main
      data-theme="business"
      className="min-h-screen bg-base-200 text-base-content transition-colors"
    >
      <Navbar />

      <motion.section
        className="container mx-auto pt-16 pb-10 px-4 md:px-8 space-y-6 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* 🧈 Updated Toasts */}
        <Toast toasts={toasts} />

        {/* Header + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <label
            htmlFor="add_modal"
            className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
          >
            + Add Product
          </label>
        </div>

        {/* Table / Empty State */}
        {productList.length > 0 ? (
          <div className="bg-base-100 shadow-lg rounded-lg p-4 overflow-x-auto">
            <ProductTable
              products={productList}
              onEdit={(p) => setEditing(p)}
              onDelete={(p) => setDeleting(p)}
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg">No products found. Add one to get started!</p>
          </div>
        )}

        {/* Modals */}
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
        {deleting && (
          <DeleteProductModal deleting={deleting} setDeleting={setDeleting} />
        )}
      </motion.section>
    </main>
  );
}
