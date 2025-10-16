import { useLoaderData, useNavigation, useActionData, useSearchParams, useNavigate } from "react-router-dom";
import { FilterBar } from "app/components/FilterBar";
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
import { useProductFilters } from "app/hooks/useProductFilters";
import { useCart } from "app/hooks/useCart";

export const action = adminAction;

export async function loader() {
  const productList = await db.select().from(products);
  return productList ?? [];
}

export default function Admin() {
  const productList = useLoaderData() as Product[];
  const { cart } = useCart();
  const navigation = useNavigation();
  const actionData = useActionData() as any;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // --- Modal and toast states ---
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: "success" | "warning" | "error" }[]
  >([]);
  const [isClosing, setIsClosing] = useState(false);
  const isSubmitting = navigation.state === "submitting";

  // --- Filter and sort state ---
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "name-asc");
  const [stockFilter, setStockFilter] = useState(params.get("stock") ?? "all");

  // --- Sync filter state to URL ---
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (search.trim()) newParams.set("search", search);
    if (sort !== "name-asc") newParams.set("sort", sort);
    if (stockFilter !== "all") newParams.set("stock", stockFilter);
    navigate({ search: newParams.toString() }, { replace: true });
  }, [search, sort, stockFilter, navigate]);

  // --- Filter + Sort logic ---
  // Admin sees **real stock**, cart is ignored
  const { filteredProducts, hasActiveFilters, clearFilters } =
    useProductFilters(productList, search, sort, stockFilter);

  // --- Reset filters ---
  const handleClearFilters = () => {
    const cleared = clearFilters();
    setSearch(cleared.search);
    setSort(cleared.sort);
    setStockFilter(cleared.stock);
    setParams({});
  };

  // --- Toast handler ---
  useEffect(() => {
    if (actionData?.success) {
      let toastType: "success" | "warning" | "error" = "success";
      if (actionData.success.includes("added")) toastType = "success";
      else if (actionData.success.includes("updated")) toastType = "warning";
      else if (actionData.success.includes("deleted")) toastType = "error";

      const newToast = {
        id: crypto.randomUUID(),
        message: actionData.success,
        type: toastType,
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
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
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* 🧈 Toasts */}
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

        {/* 🧩 Sticky Filter Bar */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          clearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Table / Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="bg-base-100 shadow-lg rounded-lg p-4 overflow-x-auto">
            <ProductTable
              products={filteredProducts}
              onEdit={(p) => setEditing(p)}
              onDelete={(p) => setDeleting(p)}
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg">No products found.</p>
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
            cartQuantityMap={new Map()} // only used for info, not for stock
          />
        )}
        {deleting && (
          <DeleteProductModal deleting={deleting} setDeleting={setDeleting} />
        )}
      </motion.section>
    </main>
  );
}
