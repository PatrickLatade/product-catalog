import { Navbar } from "app/components/Navbar";
import { useLoaderData, useSearchParams, useNavigate } from "react-router-dom";
import { Suspense, useState, useMemo, useEffect } from "react";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { ProductCard } from "app/components/ProductCard";
import { motion } from "framer-motion";
import { FilterBar } from "app/components/FilterBar";
import { useProductFilters } from "app/hooks/useProductFilters";
import { useCart } from "app/hooks/useCart"; // ✅ added import

export async function loader() {
  const result = await db.select().from(products);
  return result;
}

export default function Home() {
  const productList = useLoaderData<typeof loader>();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart } = useCart(); // ✅ access cart data

  // --- Adjust stock counts based on what's in the cart ---
  const productsWithAdjustedStock = useMemo(() => {
    return productList.map((p) => {
      const inCart = cart.find((item) => item.id === p.id);
      const adjustedStock = Math.max(p.stock - (inCart?.quantity || 0), 0);
      return {
        ...p,
        stock: adjustedStock,
      };
    });
  }, [productList, cart]);

  // --- State synced with URL ---
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "name-asc");
  const [stockFilter, setStockFilter] = useState(params.get("stock") ?? "all");

  // --- Sync state → URL when any filter changes ---
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (search.trim()) newParams.set("search", search);
    if (sort !== "name-asc") newParams.set("sort", sort);
    if (stockFilter !== "all") newParams.set("stock", stockFilter);
    navigate({ search: newParams.toString() }, { replace: true });
  }, [search, sort, stockFilter, navigate]);

  // --- Filter + Sort logic ---
  const { filteredProducts, hasActiveFilters, clearFilters } =
    useProductFilters(productsWithAdjustedStock, search, sort, stockFilter); // ✅ use adjusted list here

  // --- Reset filters ---
  const handleClearFilters = () => {
    const cleared = clearFilters();
    setSearch(cleared.search);
    setSort(cleared.sort);
    setStockFilter(cleared.stock);
    setParams({});
  };

  return (
    <div
      data-theme="business"
      className="min-h-screen bg-base-200 text-base-content transition-colors"
    >
      <Navbar />

      <main className="pt-16">
        <div className="container mx-auto p-8">
          {/* --- Title --- */}
          <motion.h1
            className="text-4xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            📋 Product List
          </motion.h1>

          {/* --- Reusable Filter Bar --- */}
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

          {/* --- Product Grid --- */}
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            }
          >
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 py-16"
              >
                <p className="text-lg">No products found.</p>
              </motion.div>
            ) : (
              <motion.div
                key={filteredProducts.length + search + sort + stockFilter}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex"
                  >
                    <div className="flex-1">
                      <ProductCard {...p} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
