import { Form } from "react-router-dom";

interface AddProductModalProps {
  isSubmitting: boolean;
  error?: string;
}

export function AddProductModal({ isSubmitting, error }: AddProductModalProps) {
  return (
    <>
      <input type="checkbox" id="add_modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box animate-slide-up max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h3 className="text-lg font-bold mb-4">Add Product</h3>

          {error && (
            <div className="alert alert-warning shadow-lg mb-4">
              <span>{error}</span>
            </div>
          )}

          <Form method="post" encType="multipart/form-data" className="space-y-3">
            <div>
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
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
                placeholder="Price"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Stock Quantity</span>
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                defaultValue={0}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Description"
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
                value="create"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              >
                Save
              </button>
              <label htmlFor="add_modal" className="btn">
                Cancel
              </label>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
