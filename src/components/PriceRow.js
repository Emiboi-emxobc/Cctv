import Div from "./Div.js";
import Text from "./Text.js";

function formatPrice(amount) {
  if (amount == null) return '';
  return `₦${Number(amount).toLocaleString()}`;
}

export default function PriceRow({ product, className = "" }) {
  if (!product) return null;
  
  const { price, promo } = product;
  const hasDiscount = promo != null && promo < price;
  const displayPrice = hasDiscount? promo : price;
  const discountPercent = hasDiscount
   ? Math.round((1 - promo / price) * 100)
    : 0;

  // Handle case where price is missing
  if (price == null) return null;

  return Div(
    { className: `price-row ${className}` },

    hasDiscount && Text(
      { className: "old-price" },
      formatPrice(price)
    ),

    Text(
      { className: "price" },
      formatPrice(displayPrice)
    ),

    hasDiscount && Text(
      { className: "discount-badge" },
      `${discountPercent}% OFF`
    )
  );
}