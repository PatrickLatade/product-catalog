import { useLoaderData, Link } from "react-router-dom";
import { db } from "app/db/client";
import { products } from "app/db/schema";

export async function loader() {
  // Fetch products from DB
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
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="card bg-base-200 shadow-md hover:shadow-lg transition"
          >
            <figure>
              <img
                src={p.imageUrl || "https://placehold.co/400x300"}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{p.name}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
              <div className="card-actions justify-end">
                <span className="font-bold text-primary">${p.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
