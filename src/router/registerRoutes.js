import { Router } from "./md-router.js";
import HomePage from "../pages/HomePage.js";
import CartPage from "../pages/CartPage.js";
import ProductPage from "../pages/ProductPage.js";
import ShopPage from "../pages/ShopPage.js";
import Layout from "../components/layout/Layout.js";
import {authGuard} from '../guards/authGuard.js';

export function registerRoutes(){
   Router.setConfig({
  appName: "Marsdove"
});

Router.register("/index.html", (HomePage), {
  layout: Layout,
  title: "Home page"
});

Router.register("/", (HomePage), {
  layout: Layout,
  title: "Marsdove"
});

Router.register("/shop", (ShopPage), {
  layout: Layout,
  title: "Shop"
});

Router.register("/product/:id", ProductPage, {
  layout: Layout,
  title: ({ params }) => `Products`
});

Router.register("/cart",(CartPage), {
  layout: Layout,
  title: "Your Cart"
});

}
