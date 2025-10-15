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
      className={`card flex flex-col h-full bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 ${
        isOutOfStock ? "opacity-60 grayscale" : "hover:scale-105"
      }`}
    >
      {/* --- Product Image --- */}
      <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-base-200 flex-shrink-0">
        <img
          src={imageUrl ?? "https://placehold.co/400x300?text=No+Image"}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
          loading="lazy"
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
      <div className="card-body p-4 flex flex-col flex-grow">
        {/* Title - fixed height */}
        <h2 className="card-title text-lg font-semibold line-clamp-2 min-h-[3.5rem]">
          {name}
        </h2>

        {/* Description - fixed height with consistent space */}
        <div className="min-h-[2.5rem] mb-4">
          {description && (
            <p className="text-sm text-base-content/70 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Price and button - pushed to bottom */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>

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