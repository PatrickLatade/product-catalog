// route.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home page — product list
  index("routes/home.tsx"),

  // Product details
  route("product/:id", "routes/product-details.tsx"),

  // Admin
  route("admin", "routes/admin.tsx"),

  // test
  route("test", "routes/test.tsx"),

  // cart
  route("cart", "routes/cart.tsx"),
] satisfies RouteConfig;
