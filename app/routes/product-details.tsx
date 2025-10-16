import { Navbar } from "app/components/Navbar";
import { Link, useLoaderData } from "react-router-dom";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { eq, ne } from "drizzle-orm";
import { motion } from "framer-motion";
import { Toast } from "app/components/admin/Toast";
import { ProductCard } from "app/components/ProductCard";
import { useState, useMemo } from "react";

// --- Loader ---
export async function loader({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [product] = await db.select().from(products).where(eq(products.id, id));

  // fetch some other random products for "related" section
  const related = await db
    .select()
    .from(products)
    .where(ne(products.id, id))
    .limit(4);

  return { product, related };
}

// --- Page Component ---
export default function ProductDetail() {
  const { product, related } = useLoaderData<typeof loader>();
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: "success" | "error" }[]
  >([]);

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

  // --- Mock Add to Cart handler ---
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const newToast = {
      id: crypto.randomUUID(),
      message: `${product.name} added to cart! 🛒`,
      type: "success" as const,
    };

    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 2000);
  };

  return (
    <main
      data-theme="business"
      className="min-h-screen bg-base-200 text-base-content"
    >
      <Navbar />
      <Toast toasts={toasts} />

      {/* --- Content Wrapper --- */}
      <motion.div
        className="flex flex-col items-center pt-16 pb-20 px-4 md:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* --- Breadcrumbs --- */}
        <nav className="breadcrumbs text-sm text-base-content/60 mb-4 self-start max-w-5xl w-full">
          <ul>
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>{product.name}</li>
          </ul>
        </nav>

        {/* --- Product Card --- */}
        <div className="card lg:card-side bg-base-100 shadow-xl max-w-5xl w-full overflow-hidden">
          {/* --- Image --- */}
          <figure className="md:w-1/2 bg-base-300 overflow-hidden relative">
            <motion.img
              src={
                product.imageUrl ||
                "https://placehold.co/600x600?text=No+Image"
              }
              alt={product.name}
              className="object-cover w-full h-full md:h-[500px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </figure>

          {/* --- Product Info --- */}
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

            {/* Stock Status */}
            <div>
              {isOutOfStock ? (
                <span className="badge badge-error text-white">
                  Out of Stock
                </span>
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
                onClick={handleAddToCart}
                className={`btn btn-primary w-full sm:w-auto ${
                  isOutOfStock ? "btn-disabled opacity-70" : ""
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* --- Related Products --- */}
        {related && related.length > 0 && (
          <motion.div
            className="max-w-6xl w-full mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-semibold mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard {...p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
