import ProductCard from "./ProductCard.js";
import Div from "../Div.js";

export default function ProductGrid(
  items = [],
  { className = "" } = {}
) {
  return Div(
    {
      className: `product-grid ${className}`.trim()
    },
    ...items.map(ProductCard)
  );
}