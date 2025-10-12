import { useLoaderData } from "react-router-dom";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { eq } from "drizzle-orm";

export async function loader({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product;
}

export default function ProductDetail() {
  const product = useLoaderData<typeof loader>();

  if (!product) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </main>
    );
  }

  return (
    <main className="p-8 flex flex-col md:flex-row gap-8">
      <img
        src={product.imageUrl || "https://placehold.co/400x400"}
        alt={product.name}
        className="w-full md:w-1/2 rounded-lg shadow-lg object-cover"
      />

      <div className="md:w-1/2 space-y-4">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-lg text-gray-500">{product.description}</p>
        <p className="text-2xl font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>

        <button className="btn btn-primary mt-4">Add to Cart</button>
      </div>
    </main>
  );
}
