import Div from "../Div.js";
import Img from "../Img.js";
import Text from "../typography/Text.js";
import {cart} from '../.././store/modules/cart.js';
import ProductName from "./ProductName.js";
import PriceRow from "./PriceRow.js";
import CartButton from "../buttons/CartButton.js";
import Card from "../card/Card.js";

export default function ProductCard(product) {
  const {
    id,
    name,
    images,
    stock
  } = product;

  const image =
    images?.[0] || "/placeholder.jpg";

  const inStock = stock > 0;

  function openProduct() {
    window.router.navigate(`/product/${id}`);
  }

  function addToCart(e) {
    e?.stopPropagation();

    if (!inStock) return;

    cart.add(product);
  }

  return Card(
    {
      className: `product-card ${
        !inStock ? "out" : ""
      }`,
      onClick: openProduct
    },

    Div(
      { className: "product-image-wrap" },

      Img({
        src: image,
        className: "product-img",
        alt: name
      })
    ),

    Div(
      { className: "card-content" },

      ProductName(product),

      PriceRow({ product }),

      !inStock &&
        Text(
          { className: "out-stock" },
          "Out of stock"
        )
    ),

    Div(
      { className: "product-actions" },

      CartButton({
        product,
        disabled: !inStock,
        onClick: addToCart
      })
    )
  );
}