import Layout from "../components/layout/Layout.js";

import HomePage from "../pages/HomePage.js";
import ShopPage from "../pages/ShopPage.js";
import CartPage from "../pages/CartPage.js";
import ProductPage from "../pages/ProductPage.js";

export function registerRoutes() {
  Router.setConfig({
    appName: "Marsdove"
  });
  
  /* =========================
     HOME
  ========================= */
  Router.register(
    "/",
    HomePage,
    {
      title: "Home",
      layout: Layout
    }
  );
  
  /* =========================
     SHOP
  ========================= */
  Router.register(
    "/shop",
    ShopPage,
    {
      title: "Shop",
      layout: Layout
    }
  );
  
  /* =========================
     PRODUCT DETAILS
  ========================= */
  Router.register(
    "/product/:id",
    ProductPage,
    {
      title: ({ params }) =>
        `Product ${params.id}`,
      layout: Layout
    }
  );
  
  /* =========================
     CART
  ========================= */
  Router.register(
    "/cart",
    CartPage,
    {
      title: "Your Cart",
      layout: Layout
    }
  );
  
  /* =========================
     INDEX FALLBACK
  ========================= */
  Router.register(
    "/index.html",
    HomePage,
    {
      title: "Home",
      layout: Layout
    }
  );
}