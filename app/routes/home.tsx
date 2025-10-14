import { Navbar } from "app/components/Navbar";
import { useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { ProductCard } from "app/components/ProductCard";
import { motion } from "framer-motion";

export async function loader() {
  const result = await db.select().from(products);
  return result;
}

export default function Home() {
  const productList = useLoaderData<typeof loader>();

  return (
    <div
      data-theme="business"
      className="min-h-screen bg-base-200 text-base-content transition-colors"
    >
      <Navbar />

      <main className="pt-16">
        <div className="container mx-auto p-8">
          <motion.h1
            className="text-4xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            🛍️ Product Catalog
          </motion.h1>

          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            }
          >
            {productList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 py-16"
              >
                <p className="text-lg">No products available yet.</p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {productList.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <ProductCard {...p} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
