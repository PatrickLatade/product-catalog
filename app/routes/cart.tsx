// app/routes/cart.tsx
import { useEffect, useRef } from "react";
import { Navbar } from "app/components/Navbar";
import { useCart } from "app/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Form, useActionData, useNavigation, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { action as cartAction } from "app/types/cartAction";

export { cartAction as action };

export default function CartPage() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const actionData = useActionData() as
    | { success?: boolean; items?: any[]; total?: number; error?: string }
    | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();

  // Prevent double navigation
  const hasNavigatedRef = useRef(false);

  // Redirect to success page if checkout succeeded
  useEffect(() => {
    if (actionData?.success && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      
      // Pass the full cart data with all details including imageUrl
      const purchasedItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      }));
      
      clearCart(); // clear cart locally
      navigate("/checkout-success", {
        state: { 
          purchasedItems: purchasedItems, 
          total: actionData.total 
        },
        replace: true,
      });
    }
  }, [actionData, cart, clearCart, navigate]);

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
          {cart.length > 0 && (
            <button onClick={clearCart} className="btn btn-outline btn-error btn-sm">
              Clear Cart
            </button>
          )}
        </div>

        {/* --- Empty State --- */}
        {cart.length === 0 ? (
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
                    {cart.map((item) => (
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
                          <Link
                            to={`/products/${item.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline btn-circle"
                              onClick={() => decreaseQuantity(item.id)}
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
                                  stock: 0,
                                  description: "",
                                } as any)
                              }
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
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* --- Cart Summary & Checkout --- */}
            <div className="flex justify-end mt-8">
              <div className="bg-base-100 shadow-lg rounded-xl p-6 w-full sm:w-80">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <p className="text-base-content/70 mb-2">
                  Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="text-lg font-bold mb-4">Total: ${total.toFixed(2)}</p>

                <Form method="post">
                  <input type="hidden" name="intent" value="checkout" />
                  <input
                    type="hidden"
                    name="cart"
                    value={JSON.stringify(
                      cart.map(({ id, quantity }) => ({ id, quantity }))
                    )}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={cart.length === 0 || isSubmitting}
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