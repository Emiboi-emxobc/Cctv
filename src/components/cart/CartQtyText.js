import Text from "../typography/Text.js";
import { reactive } from "../../helpers/reactive.js";
import { cart } from "../../store/modules/cart.js";

export default function CartQtyText({
  productId,
  variant
}) {
  return reactive("cart.items", () => {
    const item = cart.getItem(
      productId,
      variant
    );

    return Text(
      { className: "quantity-text" },
      item?.qty || 0
    );
  });
}