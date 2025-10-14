import { useFetcher } from "react-router-dom";
import type { Product } from "app/types/Product";

interface StockAdjustmentProps {
  product: Product;
}

export function StockAdjustment({ product }: StockAdjustmentProps) {
  const fetcher = useFetcher();
  const isAdjusting = fetcher.state === "submitting";

  const handleAdjustment = (adjustment: number) => {
    const newStock = Math.max(0, product.stock + adjustment);

    const formData = new FormData();
    formData.append("intent", "adjust_stock");
    formData.append("id", product.id.toString());
    formData.append("stock", newStock.toString());

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="flex items-center justify-center gap-2 h-full">
      <button
        type="button"
        onClick={() => handleAdjustment(-1)}
        disabled={isAdjusting || product.stock === 0}
        className="btn btn-xs btn-circle btn-outline btn-error"
        title="Decrease stock by 1"
      >
        −
      </button>
      <button
        type="button"
        onClick={() => handleAdjustment(1)}
        disabled={isAdjusting}
        className="btn btn-xs btn-circle btn-outline btn-success"
        title="Increase stock by 1"
      >
        +
      </button>
    </div>
  );
}
