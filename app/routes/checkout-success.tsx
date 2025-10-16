// app/routes/checkout-success.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "app/components/Navbar";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { CheckCircle, Package, Home } from "lucide-react";

interface LocationState {
  purchasedItems: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  total: number;
}

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  const items = state?.purchasedItems || [];
  const total = state?.total || 0;

  // Debug: log what data was received
  useEffect(() => {
    console.log("CheckoutSuccess received state:", state);
    console.log("Items:", items);
    console.log("Total:", total);
  }, [state, items, total]);

  const hasData = state && items.length > 0;

  return (
    <main data-theme="business" className="min-h-screen bg-base-200 text-base-content">
      <Navbar />

      <motion.div
        className="container mx-auto pt-8 pb-20 px-4 md:px-8 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {hasData ? (
          <>
            {/* Success Header */}
            <div className="bg-base-100 rounded-lg shadow-md p-6 mb-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-base-content mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-base-content/70">
                Thank you for your purchase. Your order is being processed.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-base-100 rounded-lg shadow-md overflow-hidden mb-4">
              {/* Card Header */}
              <div className="bg-primary/10 px-6 py-4 border-b border-base-300">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-base-content">
                    Order Details
                  </h2>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 pb-4 border-b border-base-300 last:border-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imageUrl || "https://placehold.co/80x80?text=No+Image"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-base-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base-content mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-base-content/60 mb-2">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-base-content/70">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-right">
                        <p className="font-semibold text-lg text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t-2 border-base-300">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-base-content/70">
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base-content/70">
                      <span>Shipping Fee</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-base-300">
                    <span className="text-lg font-semibold text-base-content">
                      Order Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Link to="/" className="btn btn-primary gap-2">
                <Home size={18} />
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-base-100 rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-error mb-3">
              ⚠️ No Order Found
            </h1>
            <p className="text-base-content/70 mb-6">
              You haven't completed a purchase yet. Please go back and shop first.
            </p>
            <Link to="/" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </motion.div>
    </main>
  );
}