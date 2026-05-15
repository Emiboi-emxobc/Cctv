import Div from "../Div.js";
import Price from "../typography/Price.js";
import Text from "../typography/Text.js";

export default function PriceRow({
  product,
  className = ""
}) {
  if (!product) return null;

  const { price, promo } = product;

  if (price == null) return null;

  const hasDiscount =
    promo != null && promo < price;

  const displayPrice = hasDiscount
    ? promo
    : price;

  const discountPercent = hasDiscount
    ? Math.round((1 - promo / price) * 100)
    : 0;

  return Div(
    {
      className: `price-row ${className}`
    },
    
    hasDiscount &&
      Price({
        amount: price,
        className: "old-price"
      }),

    Price({
      amount: displayPrice,
      className: "product-price"
    }),

    

    hasDiscount &&
      Text(
        {
          className: "discount-badge"
        },
        `-${discountPercent}%`
      )
  );
}