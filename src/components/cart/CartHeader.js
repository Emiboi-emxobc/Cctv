import Div from "../Div.js";
import Text from "../typography/Text.js";
import Title from "../typography/Title.js";
import { reactive } from "../../helpers/reactive.js";
import { cart } from "../../store/modules/cart.js";

export default function CartHeader() {
  return reactive("cart.items", () => {
    const count = cart.getCount();

    return Div(
      { className: "cart-hero" },

      Title({
        level: 1,
        className: "cart-title",
        text: "Your Cart"
      }),

      count > 0 &&
        Text(
          { className: "cart-count" },
          `${count} item${count === 1 ? "" : "s"}`
        )
    );
  });
}