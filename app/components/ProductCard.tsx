import { Link } from "react-router-dom";

type ProductCardProps = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock: number;
};

export function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  stock,
}: ProductCardProps) {
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <Link
      to={`/product/${id}`}
      className={`block card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 ${
        isOutOfStock ? "opacity-60 grayscale" : "hover:scale-105"
      }`}
    >
      {/* --- Product Image --- */}
      <figure className="relative overflow-hidden rounded-t-lg">
        <img
          src={imageUrl ?? "https://placehold.co/400x300?text=No+Image"}
          alt={name}
          className="w-full h-48 object-cover"
        />

        {/* --- Stock badge --- */}
        {isOutOfStock ? (
          <div className="absolute top-2 right-2 badge badge-error text-white shadow">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2 right-2 badge badge-warning text-white shadow">
            Low Stock ({stock})
          </div>
        ) : (
          <div className="absolute top-2 right-2 badge badge-success text-white shadow">
            In Stock ({stock})
          </div>
        )}
      </figure>

      {/* --- Product Info --- */}
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold">{name}</h2>

        {description && (
          <p className="text-sm text-base-content/70 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>

          {/* Remove the individual View Details button since entire card is clickable */}
          <span className={`btn btn-sm ${
            isOutOfStock
              ? "btn-disabled opacity-70"
              : "btn-outline btn-primary"
          }`}>
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}