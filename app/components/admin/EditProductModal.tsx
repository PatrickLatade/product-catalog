import React from "react";
import { Form } from "react-router-dom";
import type { Product } from "app/types/Product";

interface EditProductModalProps {
  editing: Product | null;
  setEditing: React.Dispatch<React.SetStateAction<Product | null>>;
  isSubmitting: boolean;
  isClosing: boolean;
  setIsClosing: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
  cartQuantityMap: Map<number, number>;
}

export function EditProductModal({
  editing,
  setEditing,
  isSubmitting,
  isClosing,
  setIsClosing,
  error,
  cartQuantityMap,
}: EditProductModalProps) {
  if (!editing) return null;

  // Get the cart quantity for this product
  const cartQuantity = cartQuantityMap.get(editing.id) || 0;
  
  // Calculate the actual stock (what's shown + what's in cart)
  const actualStock = editing.stock + cartQuantity;

  return (
    <>
      <input type="checkbox" id="edit_modal" className="modal-toggle" />
      <div
        className={`modal modal-bottom sm:modal-middle backdrop-blur-sm ${
          isClosing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        <div className="modal-box animate-slide-up max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h3 className="text-lg font-bold mb-4">Edit Product</h3>

          {error && (
            <div className="alert alert-warning shadow-lg mb-4">
              <span>{error}</span>
            </div>
          )}

          <Form method="post" encType="multipart/form-data" className="space-y-3">
            <input type="hidden" name="id" value={editing.id} />
            {/* Hidden field for cart quantity so backend knows to adjust */}
            <input type="hidden" name="cartQuantity" value={cartQuantity} />

            <div>
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={editing.name}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Price ($)</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                defaultValue={editing.price}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">
                  Stock Quantity
                  {cartQuantity > 0 && (
                    <span className="text-xs ml-2 text-info">
                      (Available: {editing.stock} | In Cart: {cartQuantity} | Actual: {actualStock})
                    </span>
                  )}
                </span>
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                defaultValue={editing.stock}
                className="input input-bordered w-full"
                required
              />
              {cartQuantity > 0 && (
                <label className="label">
                  <span className="label-text-alt text-info">
                    Modify the displayed stock value. System will automatically account for {cartQuantity} item(s) in cart.
                  </span>
                </label>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                defaultValue={editing.description || ""}
                className="textarea textarea-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>
              <input
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                className="file-input file-input-bordered w-full"
              />
            </div>

            <div className="modal-action">
              <button
                type="submit"
                name="_action"
                value="edit"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
              <label
                htmlFor="edit_modal"
                className="btn"
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    const checkbox = document.getElementById("edit_modal") as HTMLInputElement | null;
                    if (checkbox) checkbox.checked = false;
                    setEditing(null);
                    setIsClosing(false);
                  }, 300);
                }}
              >
                Cancel
              </label>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}