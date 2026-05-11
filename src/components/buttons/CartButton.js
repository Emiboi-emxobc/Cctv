import Button from "./Button.js";
import Icon from "../icons/Icon.js";

export default function CartButton({
  onClick,
  disabled = false
} = {}) {
  return Button(
    {
      className: "btn-secondary cart-btn",
      onClick,
      disabled,
      type: "button"
    },
    
    Icon({ name: "shopping-cart" }),
    "Add to Cart"
  );
}