import Div from "../Div.js";
import Img from "../Img.js";
import Text from "../typography/Text.js";
import Price from "../typography/Price.js";

import CartQty from "./CartQty.js";
import CartRemoveButton from "./CartRemoveButton.js";

import { truncate } from "../../helpers/truncate.js";

export default function CartItem(item) {
  return Div(
    { className: "cart-item" },

    Img({
      src: item.images?.[0] || item.image || "",
      alt: item.name,
      className: "cart-item-img"
    }),

    Div(
      { className: "cart-item-content" },

      Div(
        { className: "cart-item-info" },

        Text(
          { className: "cart-item-name" },
          truncate(item.name, 22)
        ),

        item.variant &&
          Text(
            { className: "cart-item-variant" },
            item.variant
          ),

        Price({
          amount: item.price,
          className: "cart-item-price"
        })
      ),

      Div(
        { className: "cart-item-actions" },

        CartQty({
          productId: item.id,
          variant: item.variant
        }),

        CartRemoveButton({
          productId: item.id,
          variant: item.variant
        })
      )
    )
  );
}