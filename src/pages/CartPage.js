import Div from "../components/Div.js";
import Page from "../components/page/Page.js";
import { cart } from "../store/modules/cart.js";
import CartList from "../components/cart/CartList.js";
import CartSummary from "../components/cart/CartSummary.js";

export default function CartPage() {
  return Page(
    {
      title: !cart.isEmpty()?  "Your Cart" : null,
      subtitle: "Review items before checkout",
      className: "cart-page",
      showHeader: !cart.isEmpty()
    },

    Div(
      { className: "cart-content" },
      CartList(),
      CartSummary()
    )
  );
}