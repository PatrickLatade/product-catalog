// route.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home page — product list
  index("routes/home.tsx"),

  // Product details
  route("product/:id", "routes/product-details.tsx"),

  // Admin
  route("admin", "routes/admin.tsx"),

  // cart
  route("cart", "routes/cart.tsx"),

  // checout
  route("checkout-success", "routes/checkout-success.tsx"),

  // API route
  route("api/products", "routes/api/products.ts"),
] satisfies RouteConfig;
