import Div from "../Div.js";
import Paragraph from "../typography/Paragraph.js";

import Icon from "../icons/Icon.js";
import { Store } from "../../store/store.js";
import { reactive } from "../../helpers/reactive.js";

export default function IncreaseButton({
  productId, variant,className
}) {
  function increase(e) {
    e?.stopPropagation();
    Store.cart.increase(productId, variant);
  }

  function decrease(e) {
    e?.stopPropagation();
    Store.cart.decrease(productId, variant);
    alert()
  }

  return reactive("cart.items", () => {
    const qty = Store.getCount(productId, variant);

    if (!qty) return null;

    return Div(
      { className: "increase-btn" },

      SecondaryButton(
        {
          className: "decrease-btn qty-btn",
          onClick: decrease,
          ariaLabel: "Decrease quantity"
        },
        Icon({ name: "minus" })
      ),

      Paragraph(
        { className: "quantity-text" },
        qty
      ),

      PrimaryButton(
        {
          className: "increase-btn-add qty-btn",
          onClick: increase,
          ariaLabel: "Increase quantity"
        },
        Icon({ name: "plus" })
      )
    );
  });
}