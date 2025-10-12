import { useLoaderData } from "react-router-dom";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { ProductCard } from "app/components/Productcard";

export async function loader() {
  const result = await db.select().from(products);
  return result;
}

export default function Home() {
  const productList = useLoaderData<typeof loader>();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Product List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productList.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}
