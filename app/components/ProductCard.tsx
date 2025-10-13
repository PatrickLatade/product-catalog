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
    <div
      className={`card bg-base-100 shadow-xl transition ${
        isOutOfStock ? "opacity-60 grayscale" : "hover:shadow-2xl"
      }`}
    >
      <figure className="relative">
        <img
          src={imageUrl ?? "https://placehold.co/400x300"}
          alt={name}
          className="w-full h-48 object-cover"
        />

        {/* 🏷️ Stock badge */}
        {isOutOfStock ? (
          <div className="absolute top-2 right-2 badge badge-error text-white">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2 right-2 badge badge-warning text-white">
            Low Stock ({stock})
          </div>
        ) : (
          <div className="absolute top-2 right-2 badge badge-success text-white">
            In Stock ({stock})
          </div>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        {description && (
          <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        <div className="card-actions justify-between items-center mt-2">
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>

          <Link
            to={`/product/${id}`}
            className={`btn btn-outline btn-sm ${
              isOutOfStock ? "btn-disabled" : ""
            }`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
