import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon, ShoppingCart, Home, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "app/hooks/useCart"; // ✅ for live cart count

export function Navbar() {
  const [theme, setTheme] = useState<string>("light");
  const [isMounted, setIsMounted] = useState(false);
  const { cart } = useCart(); // ✅ Cart state
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Initialize theme after mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Persist theme to <html> + localStorage
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6 sticky top-0 z-40 transition-colors">
      {/* --- Left: Logo --- */}
      <div className="flex-1">
        <Link
          to="/"
          className="text-xl font-bold flex items-center gap-2 hover:text-primary transition"
        >
          🛍️ Product Catalog
        </Link>
      </div>

      {/* --- Right: Nav Links + Theme Toggle --- */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 hidden sm:flex items-center gap-3">
          {/* --- Home Link --- */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "text-primary font-semibold" : ""}`
              }
            >
              <Home size={18} />
              Home
            </NavLink>
          </li>

          {/* --- Admin Link --- */}
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "text-primary font-semibold" : ""}`
              }
            >
              <Settings size={18} />
              Admin
            </NavLink>
          </li>

          {/* --- Cart Link w/ Badge --- */}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-1 ${isActive ? "text-primary font-semibold" : ""}`
              }
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="badge badge-sm badge-primary text-white absolute -top-2 -right-3">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </li>

          {/* --- Theme Toggle --- */}
          <li>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle hover:bg-base-200"
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isMounted &&
                    (theme === "light" ? (
                      <MoonIcon size={18} />
                    ) : (
                      <SunIcon size={18} />
                    ))}
                </motion.div>
              </AnimatePresence>
            </button>
          </li>
        </ul>

        {/* --- Mobile Menu --- */}
        <div className="dropdown dropdown-end sm:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-44"
          >
            <li>
              <NavLink to="/">
                <Home size={16} className="mr-1" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin">
                <Settings size={16} className="mr-1" /> Admin
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart">
                <ShoppingCart size={16} className="mr-1" /> Cart{" "}
                {cartCount > 0 && (
                  <span className="badge badge-sm badge-primary ml-1 text-white">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className="btn btn-ghost justify-start"
              >
                {isMounted &&
                  (theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode")}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
