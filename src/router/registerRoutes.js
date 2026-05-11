import Layout from "../components/layout/Layout.js";

import ShopPage from "../pages/ShopPage.js";
import CartPage from "../pages/CartPage.js";

import { authGuard } from "../guards/authGuard.js";

export function registerRoutes() {
  Router.setConfig({
    appName: "Marsdove"
  });
  
  Router.register(
    "/",
    () => Layout(CartPage()),
    {
      title: "Home page"
    }
  );
  
Router.register(
    "/cart",
    () => Layout(CartPage()),
    {
      title: "Your cart"
    }
  );
  
  
  Router.register(
    "/shop",
    (props) => Layout(
      ShopPage(props)
    ),
    {
      title: "Shop"
    }
  );
  
  Router.register(
    "/index.html",
    () => Layout(CartPage()),
    {
      title: "Your cart"
    }
  );
}