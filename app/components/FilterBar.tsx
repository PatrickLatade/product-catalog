import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  stockFilter: string;
  setStockFilter: (val: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  title?: string; // Optional title for Admin vs Home
}

export function FilterBar({
  search,
  setSearch,
  sort,
  setSort,
  stockFilter,
  setStockFilter,
  clearFilters,
  hasActiveFilters,
  title,
}: FilterBarProps) {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll compression
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className={`sticky top-[5rem] z-[35] bg-base-200/80 backdrop-blur-md border border-base-300 rounded-lg transition-all duration-300 ${
        scrolled ? "py-2 px-3 shadow-md scale-[0.98]" : "py-3 px-4 shadow-sm"
      } mb-6`}
      style={{ marginTop: "1.5rem" }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {title && (
        <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">
          {title}
        </h2>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Search */}
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            className={`input input-bordered w-full transition-all duration-300 ${
              scrolled ? "input-sm" : "input-md"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort + Filter + Clear */}
        <div className="flex flex-wrap justify-end items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <select
            className={`select select-bordered w-[8rem] sm:w-40 transition-all duration-300 ${
              scrolled ? "select-sm" : "select-md"
            }`}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            className={`select select-bordered w-[10rem] sm:w-48 transition-all duration-300 ${
              scrolled ? "select-sm" : "select-md"
            }`}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="price-asc">Price (Low → High)</option>
            <option value="price-desc">Price (High → Low)</option>
          </select>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                key="clear-filters"
                className={`btn btn-outline transition-all duration-300 ${
                  scrolled ? "btn-xs sm:btn-sm" : "btn-sm sm:btn-md"
                }`}
                onClick={clearFilters}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
