import Div from "../Div.js";
import Img from "../Img.js";
import Text from "../typography/Text.js";
import Price from "../typography/Price.js";

import CartQty from "./CartQty.js";
import CartRemoveButton from "./CartRemoveButton.js";

export default function CartItem(item) {
  return Div(
    { className: "cart-item" },

    // IMAGE
    Div(
      { className: "cart-item-image-wrap" },
      Img({
        src: item.images[0],
        alt: item.name,
        className: "cart-item-img"
      })
    ),

    // CONTENT
    Div(
      { className: "cart-item-body" },

      // TOP ROW: name + remove
      Div(
        { className: "cart-item-top" },

        Div(
          { className: "cart-item-title-wrap" },

          Text(
            { className: "cart-item-name" },
            item.name
          ),

          item.variant &&
            Text(
              { className: "cart-item-variant" },
              item.variant
            )
        ),

        CartRemoveButton({
          productId: item.id,
          variant: item.variant
        })
      ),

      // BOTTOM ROW: price + qty
      Div(
        { className: "cart-item-bottom" },

        Price({
          amount: item.price,
          className: "cart-item-price"
        }),

        CartQty({
          productId: item.id,
          variant: item.variant
        })
      )
    )
  );
}