import React from "react";
import type { Product } from "app/types/Product";
import { StockAdjustment } from "./StockAdjustment";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-auto">
        <thead>
          <tr>
            <th className="whitespace-nowrap">Name</th>
            <th className="whitespace-nowrap">Price ($)</th>
            <th className="whitespace-nowrap">Stock</th>
            <th className="text-center whitespace-nowrap">Quick Add</th>
            <th className="whitespace-nowrap">Description</th>
            <th className="whitespace-nowrap text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(products ?? []).map((p) => (
            <tr key={p.id} className="align-middle">
              {/* NAME */}
              <td className="py-3">{p.name}</td>

              {/* PRICE */}
              <td className="py-3">{p.price.toFixed(2)}</td>

              {/* STOCK */}
              <td className="py-3">
                <div className="flex items-center gap-3">
                  {p.stock <= 0 ? (
                    <span className="badge badge-error text-white">Out</span>
                  ) : p.stock <= 5 ? (
                    <span className="badge badge-warning text-white">{p.stock}</span>
                  ) : (
                    <span className="badge badge-success text-white">{p.stock}</span>
                  )}
                </div>
              </td>

              {/* QUICK ADD */}
              <td className="py-3 text-center px-4">
                <StockAdjustment product={p} />
              </td>

              {/* DESCRIPTION */}
              <td className="max-w-sm truncate py-3">{p.description}</td>

              {/* ACTIONS */}
              <td className="py-3 text-center">
                <div className="flex justify-center gap-2">
                  <label
                    htmlFor="edit_modal"
                    className="btn btn-outline btn-sm"
                    onMouseDown={() => onEdit(p)}
                  >
                    Edit
                  </label>
                  <label
                    htmlFor="delete_modal"
                    className="btn btn-error btn-sm"
                    onClick={() => onDelete(p)}
                  >
                    Delete
                  </label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
