import Div from "../Div.js";
import { reactive } from "../../helpers/reactive.js";
import { cart } from "../../store/modules/cart.js";

export default function CartCount() {
  return reactive("cart.items", () =>
    Div(
      { className: "badge cart-badge" },
      cart.getCount()
    )
  );
}