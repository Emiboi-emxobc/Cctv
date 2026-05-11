import IconButton from "../icons/IconButton.js";
import CartCount from "./CartCount.js";

export default function CartIcon() {
  return IconButton(
    {
      className: "cart-btn",
      route: "/cart",
      icon: "shopping-cart"
    },
    
    CartCount()
  );
}