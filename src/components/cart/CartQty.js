import Div from "../Div.js";
import Button from "../buttons/Button.js";
import SecondaryButton from "../buttons/SecondaryButton.js";

import PrimaryButton from "../buttons/PrimaryButton.js";
import { cart } from "../../store/modules/cart.js";
import CartQtyText from "./CartQtyText.js";

export default function CartQty({
  productId,
  variant,
  className
}) {
  function increase(e) {
    e?.stopPropagation();
    cart.increase(productId, variant);
  }

  function decrease(e) {
    e?.stopPropagation();
    cart.decrease(productId, variant);
  }

  return Div(
    { className: "qty-controls  "+className },

    SecondaryButton(
      {
        className: "qty-btn ",
        onClick: decrease
      },
      "−"
    ),

    CartQtyText({
      productId,
      variant
    }),

    PrimaryButton(
      {
        className: "qty-btn ",
        onClick: increase
      },
      "+"
    )
  );
}