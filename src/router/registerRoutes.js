import Layout from "../components/layout/Layout.js";

import HomePage from "../pages/HomePage.js";
import ShopPage from "../pages/ShopPage.js";
import CartPage from "../pages/CartPage.js";

import { authGuard } from "../guards/authGuard.js";

export function registerRoutes() {
  Router.setConfig({
    appName: "Marsdove"
  });

  /* =========================
     HOME
  ========================= */
  Router.register(
    "/",
    () => Layout(HomePage()),
    {
      title: "Home"
    }
  );

  /* =========================
     SHOP
  ========================= */
  Router.register(
    "/shop",
    (props) =>
      Layout(
        ShopPage(props)
      ),
    {
      title: "Shop"
    }
  );

  /* =========================
     CART
  ========================= */
  Router.register(
    "/cart",
    () => Layout(CartPage()),
    {
      title: "Your Cart"
    }
  );

  /* =========================
     INDEX FALLBACK
  ========================= */
  Router.register(
    "/index.html",
    () => Layout(HomePage()),
    {
      title: "Home"
    }
  );
}