import { useEffect, useRef, useState } from "react";
import { Navbar } from "app/components/Navbar";
import { useCart } from "app/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Form, useActionData, useNavigation, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, AlertTriangle } from "lucide-react";
import { action as cartAction } from "app/types/cartAction";

export { cartAction as action };

export default function CartPage() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart } = useCart();
  const [validatedCart, setValidatedCart] = useState(cart);
  const [stockMap, setStockMap] = useState<Record<number, number>>({});
  const [isChecking, setIsChecking] = useState(true);
  const total = validatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const actionData = useActionData() as
    | { success?: boolean; items?: any[]; total?: number; error?: string }
    | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  // ✅ Reusable validator (now runs periodically)
  async function validateCartStock() {
    try {
      setIsChecking(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch product stock");
      const products = await res.json();

      const newStockMap: Record<number, number> = {};
      const filtered = cart.filter((item) => {
        const latest = products.find((p: any) => p.id === item.id);
        if (latest) newStockMap[item.id] = latest.stock;
        return latest && latest.stock > 0;
      });

      setStockMap(newStockMap);
      setValidatedCart(filtered);
      setIsChecking(false);

      // Remove items that no longer exist or are out of stock
      if (filtered.length !== cart.length) {
        clearCart();
        filtered.forEach((item) => {
          const productLike = {
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            stock: newStockMap[item.id] ?? 0,
            description: "",
          };
          addToCart(productLike as any, item.quantity);
        });
      }
    } catch (err) {
      console.error("Stock validation failed:", err);
      setIsChecking(false);
    }
  }

  // ✅ Validate immediately, and then every 10 seconds
  useEffect(() => {
    validateCartStock();
    const interval = setInterval(validateCartStock, 10000);
    return () => clearInterval(interval);
  }, [cart.length]);

  // ✅ Redirect to success page after checkout
  useEffect(() => {
    if (actionData?.success && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;

      const purchasedItems = validatedCart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }));

      clearCart();
      navigate("/checkout-success", {
        state: { purchasedItems, total: actionData.total },
        replace: true,
      });
    }
  }, [actionData, validatedCart, clearCart, navigate]);

  return (
    <main data-theme="business" className="min-h-screen bg-base-200 text-base-content">
      <Navbar />

      <motion.div
        className="container mx-auto pt-16 pb-20 px-4 md:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🛒 Your Cart</h1>
          {validatedCart.length > 0 && (
            <button onClick={clearCart} className="btn btn-outline btn-error btn-sm">
              Clear Cart
            </button>
          )}
        </div>

        {/* --- Empty State --- */}
        {validatedCart.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg text-base-content/70 mb-4">Your cart is empty.</p>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Link>
          </motion.div>
        ) : (
          <>
            {/* --- Cart Table --- */}
            <div className="overflow-x-auto">
              <table className="table w-full bg-base-100 shadow rounded-lg">
                <thead>
                  <tr className="text-base-content/70">
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {validatedCart.map((item) => {
                      const latestStock = stockMap[item.id];
                      const isOut = latestStock !== undefined && latestStock <= 0;

                      return (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="flex items-center gap-4 py-3">
                            <img
                              src={item.imageUrl || "https://placehold.co/80x80?text=No+Image"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex flex-col">
                              <Link
                                to={`/products/${item.id}`}
                                className="font-medium hover:text-primary"
                              >
                                {item.name}
                              </Link>

                              {isChecking ? (
                                <span className="badge badge-ghost text-xs mt-1">
                                  Checking stock...
                                </span>
                              ) : isOut ? (
                                <span className="text-error text-sm flex items-center gap-1 mt-1">
                                  <AlertTriangle size={14} /> No longer available
                                </span>
                              ) : (
                                <span className="badge badge-success text-xs mt-1">
                                  In stock
                                </span>
                              )}
                            </div>
                          </td>

                          <td>${item.price.toFixed(2)}</td>

                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                className="btn btn-sm btn-outline btn-circle"
                                onClick={() => decreaseQuantity(item.id)}
                                disabled={isOut}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-semibold w-6 text-center">{item.quantity}</span>
                              <button
                                className="btn btn-sm btn-outline btn-circle"
                                onClick={() =>
                                  addToCart({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    imageUrl: item.imageUrl,
                                    stock: latestStock ?? 0,
                                    description: "",
                                  } as any)
                                }
                                disabled={isOut}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>

                          <td className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>

                          <td>
                            <button
                              className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
                              onClick={() => removeFromCart(item.id)}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* --- Cart Summary & Checkout --- */}
            <div className="flex justify-end mt-8">
              <div className="bg-base-100 shadow-lg rounded-xl p-6 w-full sm:w-80">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <p className="text-base-content/70 mb-2">
                  Items: {validatedCart.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="text-lg font-bold mb-4">Total: ${total.toFixed(2)}</p>

                <Form method="post">
                  <input type="hidden" name="intent" value="checkout" />
                  <input
                    type="hidden"
                    name="cart"
                    value={JSON.stringify(
                      validatedCart.map(({ id, quantity }) => ({ id, quantity }))
                    )}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={validatedCart.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? "Checking out..." : "Checkout 🛒"}
                  </button>
                </Form>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}