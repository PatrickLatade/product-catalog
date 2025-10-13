import { Form } from "react-router-dom";
import type { Product } from "app/types/Product";

interface DeleteProductModalProps {
  deleting: Product | null;
  setDeleting: React.Dispatch<React.SetStateAction<Product | null>>;
}

export function DeleteProductModal({ deleting, setDeleting }: DeleteProductModalProps) {
  return (
    <>
      <input type="checkbox" id="delete_modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box animate-slide-up max-w-md">
          {deleting && (
            <>
              <h3 className="text-lg font-bold mb-4 text-error">Confirm Delete</h3>
              <p>
                Are you sure you want to delete <strong>{deleting.name}</strong>?
              </p>
              <div className="modal-action">
                <Form method="post">
                  <input type="hidden" name="id" value={deleting.id} />
                  <button
                    type="submit"
                    name="_action"
                    value="delete"
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                </Form>
                <label
                  htmlFor="delete_modal"
                  className="btn"
                  onClick={() => setDeleting(null)}
                >
                  Cancel
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
