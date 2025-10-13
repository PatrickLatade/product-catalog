import React from "react";
import type { Product } from "app/types/Product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(products ?? []).map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>
                {p.stock <= 0 ? (
                  <span className="badge badge-error text-white">Out</span>
                ) : p.stock <= 5 ? (
                  <span className="badge badge-warning text-white">{p.stock}</span>
                ) : (
                  <span className="badge badge-success text-white">{p.stock}</span>
                )}
              </td>
              <td className="max-w-sm truncate">{p.description}</td>
              <td className="flex gap-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
