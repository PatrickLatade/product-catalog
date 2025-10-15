import { useMemo } from "react";
import type { Product } from "app/types/Product";

/**
 * useProductFilters
 * Handles filtering, sorting, and search logic for a list of products.
 */
export function useProductFilters(
  productList: Product[],
  search: string,
  sort: string,
  stockFilter: string
) {
  const filteredProducts = useMemo(() => {
    let filtered = productList.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );

    // --- Stock filters ---
    switch (stockFilter) {
      case "in-stock":
        filtered = filtered.filter((p) => p.stock > 5);
        break;
      case "low-stock":
        filtered = filtered.filter((p) => p.stock > 0 && p.stock <= 5);
        break;
      case "out-of-stock":
        filtered = filtered.filter((p) => p.stock <= 0);
        break;
    }

    // --- Sort filters ---
    switch (sort) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [productList, search, sort, stockFilter]);

  const hasActiveFilters =
    search.trim() !== "" || sort !== "name-asc" || stockFilter !== "all";

  const clearFilters = () => ({
    search: "",
    sort: "name-asc",
    stock: "all",
  });

  return { filteredProducts, hasActiveFilters, clearFilters };
}
