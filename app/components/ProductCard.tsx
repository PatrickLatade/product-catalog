import { Link } from "react-router-dom";

type ProductCardProps = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
};

export function ProductCard({ id, name, description, price, imageUrl }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
      <figure>
        <img
        src={imageUrl ?? "https://placehold.co/400x300"}
        alt={name}
        className="w-full h-48 object-cover"
        />
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
          <Link to={`/product/${id}`} className="btn btn-outline btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
