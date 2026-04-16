import { Router } from "./md-router.js";
import HomePage from "../pages/HomePage.js";
import CartPage from "../pages/CartPage.js";

import Layout from "../components/layout/Layout.js";


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

/*Router.register("/shop", (ShopPage), {
  layout: Layout,
  title: "Shop"
});

Router.register("/product/:id", ProductPage, {
  layout: Layout,
  title: ({ params }) => `Products`
});*/

Router.register("/cart",(CartPage), {
  layout: Layout,
  title: "Your Cart"
});

}
