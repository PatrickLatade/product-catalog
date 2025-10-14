import { Form } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Product } from "app/types/Product";

interface DeleteProductModalProps {
  deleting: Product | null;
  setDeleting: React.Dispatch<React.SetStateAction<Product | null>>;
}

export function DeleteProductModal({ deleting, setDeleting }: DeleteProductModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Reset closing state whenever a new modal opens
  useEffect(() => {
    if (deleting) setIsClosing(false);
  }, [deleting]);

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDeleting(null);
      setIsClosing(false);
    }, 300);
  };

  if (!deleting) return null;

  return (
    <>
      <input type="checkbox" id="delete_modal" className="modal-toggle" checked readOnly />
      <div
        className={`modal modal-bottom sm:modal-middle backdrop-blur-sm ${
          isClosing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        <div className="modal-box animate-slide-up max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-error">Confirm Delete</h3>
          <p>
            Are you sure you want to delete <strong>{deleting.name}</strong>?
          </p>
          <div className="modal-action">
            <Form method="post">
              <input type="hidden" name="id" value={deleting.id} />
              <button type="submit" name="_action" value="delete" className="btn btn-error">
                Delete
              </button>
            </Form>
            <button className="btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}