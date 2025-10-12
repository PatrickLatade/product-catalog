import {
  Form,
  useLoaderData,
  redirect,
  useNavigation,
  useActionData,
} from "react-router-dom";
import { db } from "app/db/client";
import { products } from "app/db/schema";
import { eq } from "drizzle-orm";
import { useState, useEffect } from "react";
import fs from "fs/promises";
import path from "path";

// 🧠 LOADER: fetch products
export async function loader() {
  const result = await db.select().from(products);
  return result;
}

// ⚙️ ACTION: handle create/edit/delete + validation
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = formData.get("_action");

  const name = (formData.get("name") as string)?.trim();
  const price = Number(formData.get("price"));
  const description = (formData.get("description") as string) || "";
  const file = formData.get("image") as File | null;
  const id = formData.get("id") ? Number(formData.get("id")) : undefined;

  // 🧩 Validation
  if (intent !== "delete") {
    if (!name) return { error: "Product name is required." };
    if (isNaN(price) || price <= 0)
      return { error: "Price must be a positive number." };
  }

  let imagePath = "";

  // 📸 Handle file upload
  if (file && file.name) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "images");

    // ensure /images folder exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    // set relative path for DB
    imagePath = `/images/${file.name}`;
  }

  try {
    if (intent === "create") {
      await db.insert(products).values({
        name,
        price,
        description,
        imageUrl: imagePath,
      });
      return { success: "✅ Product created successfully!" };
    }

    if (intent === "edit" && id) {
      await db
        .update(products)
        .set({
          name,
          price,
          description,
          ...(imagePath && { imageUrl: imagePath }), // only update if new file uploaded
        })
        .where(eq(products.id, id));
      return { success: "✏️ Product updated successfully!" };
    }

    if (intent === "delete" && id) {
      await db.delete(products).where(eq(products.id, id));
      return { success: "🗑️ Product deleted successfully!" };
    }
  } catch (err) {
    return { error: "❌ Something went wrong. Please try again." };
  }

  return redirect("/admin");
}

// 🧱 COMPONENT
export default function Admin() {
  const productList = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const actionData = useActionData() as { success?: string; error?: string } | undefined;
  const [editing, setEditing] = useState<any | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const isSubmitting = navigation.state === "submitting";

  // 🔔 Toast logic
  useEffect(() => {
    if (actionData?.success) setToast({ message: actionData.success, type: "success" });
    if (actionData?.error) setToast({ message: actionData.error, type: "error" });
  }, [actionData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <main className="p-8 space-y-6 relative">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      {/* 🌈 Toasts */}
      <div className="toast toast-top toast-end z-50">
        {toast && (
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            } shadow-lg animate-slide-in-right`}
          >
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      {/* Add Product Button */}
      <label htmlFor="add_modal" className="btn btn-primary">
        + Add Product
      </label>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price.toFixed(2)}</td>
                <td className="max-w-sm truncate">{p.description}</td>
                <td className="flex gap-2">
                  <label
                    htmlFor="edit_modal"
                    className="btn btn-outline btn-sm"
                    onClick={() => setEditing(p)}
                  >
                    Edit
                  </label>
                  <label
                    htmlFor="delete_modal"
                    className="btn btn-error btn-sm"
                    onClick={() => setDeleting(p)}
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ➕ Add Product Modal */}
      <input type="checkbox" id="add_modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box animate-slide-up max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h3 className="text-lg font-bold mb-4">Add Product</h3>

          {actionData?.error && (
            <div className="alert alert-warning shadow-lg mb-4">
              <span>{actionData.error}</span>
            </div>
          )}

          <Form method="post" encType="multipart/form-data" className="space-y-3">
            <div>
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Price ($)</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                placeholder="Price"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                placeholder="Description"
                className="textarea textarea-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>
              <input
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                className="file-input file-input-bordered w-full"
              />
            </div>

            <div className="modal-action">
              <button
                type="submit"
                name="_action"
                value="create"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              >
                Save
              </button>
              <label htmlFor="add_modal" className="btn">
                Cancel
              </label>
            </div>
          </Form>
        </div>
      </div>

      {/* ✏️ Edit Product Modal */}
      <input type="checkbox" id="edit_modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box animate-slide-up max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h3 className="text-lg font-bold mb-4">Edit Product</h3>

          {actionData?.error && (
            <div className="alert alert-warning shadow-lg mb-4">
              <span>{actionData.error}</span>
            </div>
          )}

          {editing && (
            <Form method="post" encType="multipart/form-data" className="space-y-3">
              <input type="hidden" name="id" value={editing.id} />

              <div>
                <label className="label">
                  <span className="label-text">Product Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editing.name}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={editing.price}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  defaultValue={editing.description || ""}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text">Product Image</span>
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg"
                  className="file-input file-input-bordered w-full"
                />
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  name="_action"
                  value="edit"
                  className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                >
                  Update
                </button>
                <label htmlFor="edit_modal" className="btn">
                  Cancel
                </label>
              </div>
            </Form>
          )}
        </div>
      </div>

      {/* ❌ Delete Confirmation Modal */}
      <input type="checkbox" id="delete_modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box animate-slide-up max-w-md">
          {deleting && (
            <>
              <h3 className="text-lg font-bold mb-4 text-error">
                Confirm Delete
              </h3>
              <p>
                Are you sure you want to delete{" "}
                <strong>{deleting.name}</strong>?
              </p>
              <div className="modal-action">
                <Form method="post">
                  <input type="hidden" name="id" value={deleting.id} />
                  <button
                    type="submit"
                    name="_action"
                    value="delete"
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                </Form>
                <label htmlFor="delete_modal" className="btn">
                  Cancel
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
