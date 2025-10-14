import { Navbar } from "app/components/Navbar";
import { Link, useLoaderData } from "react-router-dom";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { eq } from "drizzle-orm";
import { motion } from "framer-motion";

// --- Loader ---
export async function loader({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product;
}

// --- Page Component ---
export default function ProductDetail() {
  const product = useLoaderData<typeof loader>();

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-base-200 text-base-content">
        <h1 className="text-3xl font-bold mb-4">Product not found</h1>
        <Link to="/" className="btn btn-primary">
          Back to Products
        </Link>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <main
      data-theme="business"
      className="min-h-screen bg-base-200 text-base-content"
    >
      <Navbar />

      {/* This wrapper ensures content starts *below* the sticky navbar */}
      <div className="flex flex-col items-center pt-16 pb-10 px-4 md:px-8">
        <motion.div
          className="card lg:card-side bg-base-100 shadow-xl max-w-5xl w-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* --- Image Section --- */}
          <figure className="md:w-1/2 bg-base-300 flex items-center justify-center">
            <img
              src={product.imageUrl || "https://placehold.co/600x600?text=No+Image"}
              alt={product.name}
              className="object-cover w-full h-full md:h-[500px]"
            />
          </figure>

          {/* --- Info Section --- */}
          <div className="card-body md:w-1/2 space-y-4">
            <Link to="/" className="text-sm text-primary hover:underline">
              ← Back to Products
            </Link>

            <h1 className="text-4xl font-bold">{product.name}</h1>

            {product.description && (
              <p className="text-base text-base-content/70 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock status */}
            <div>
              {isOutOfStock ? (
                <span className="badge badge-error text-white">Out of Stock</span>
              ) : isLowStock ? (
                <span className="badge badge-warning text-white">
                  Low Stock ({product.stock})
                </span>
              ) : (
                <span className="badge badge-success text-white">
                  In Stock ({product.stock})
                </span>
              )}
            </div>

            {/* Price */}
            <p className="text-3xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>

            <div className="card-actions mt-4">
              <button
                className={`btn btn-primary w-full sm:w-auto ${
                  isOutOfStock ? "btn-disabled opacity-70" : ""
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
