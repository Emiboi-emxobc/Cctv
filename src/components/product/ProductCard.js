import Div from "../Div.js";
import Img from "../Img.js";
import Text from "../typography/Text.js";
import Card from "../card/Card.js";
import Button from "../buttons/Button.js";

import ProductName from "./ProductName.js";
import PriceRow from "./PriceRow.js";
import CartQty from "../cart/CartQty.js";

import { cart } from "../../store/modules/cart.js";
import { reactive } from "../../helpers/reactive.js";

export default function ProductCard(product) {
  return reactive("cart.items", () => {
    const {
      id,
      name,
      images,
      stock = 0
    } = product;

    const image = images?.[0] || "/placeholder.jpg";
    const inStock = stock > 0;

    const existing = cart.getItem(id);

    function openProduct() {
      window.router.navigate(`/product/${id}`);
    }

    function addToCart(e) {
      e?.stopPropagation();
      if (!inStock) return;
      cart.add(product);
    }

    function buyNow(e) {
      e?.stopPropagation();

      if (!inStock) return;

      cart.add(product);
      window.router.navigate("/checkout");
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
          alt: name,
          className: "product-img"
        })
      ),

      Card.Body(
        { className: "product-card-body" },

        ProductName(product),

        PriceRow({ product }),

        !inStock &&
          Text(
            {
              className: "product-stock-status"
            },
            "Out of stock"
          )
      ),

      inStock &&
        Div(
          { className: "product-actions" },

          existing
            ? CartQty({
                productId: id,
                compact: true
              })
            : [
                Button(
                  {
                    className: "btn-primary",
                    onClick: addToCart
                  },
                  "Add to Cart"
                ),

                Button(
                  {
                    className: "btn-secondary",
                    onClick: buyNow
                  },
                  "Buy Now"
                )
              ]
        )
    );
  });
}