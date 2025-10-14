import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [theme, setTheme] = useState<string>("light");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize after mount
  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Persist theme to <html> + localStorage
  useEffect(() => {
    if (isMounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6 sticky top-0 z-40 transition-colors">
      <div className="flex-1">
        <Link
          to="/"
          className="text-xl font-bold flex items-center gap-2 hover:text-primary transition"
        >
          🛍️ Product Catalog
        </Link>
      </div>

      <div className="flex-none gap-3">
        {/* --- Desktop Links --- */}
        <ul className="menu menu-horizontal px-1 hidden sm:flex">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : ""
              }
            >
              Admin
            </NavLink>
          </li>
        </ul>

        {/* --- Animated Theme Toggle --- */}
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
              {isMounted && (theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />)}
            </motion.div>
          </AnimatePresence>
        </button>

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
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
