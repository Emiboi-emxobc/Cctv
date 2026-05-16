import Div from "../Div.js";
import Text from "../typography/Text.js";
import CartButton from "../buttons/CartButton.js";
import PriceRow from "./PriceRow.js";

import Detail from "../common/Detail.js";

import { cart } from "../../store/modules/cart.js";

export default function ProductInfo(
  product
) {
  const inStock =
    product.stock > 0;

  const price =
    product.promo &&
    product.promo < product.price
      ? product.promo
      : product.price;

  function addToCart() {
    if (!inStock) return;

    cart.add({
      id: product.id,
      name: product.name,
      price,
      image: product.images?.[0],
      variant:
        product.variant || null
    });
  }

  return Div(
    {
      className: "product-info"
    },

    /* ======================
       TITLE
    ====================== */
    Text(
      {
        className:
          "product-title"
      },
      product.name
    ),

    /* ======================
       PRICE
    ====================== */
    PriceRow({
      product,
      className:
        "product-price-block"
    }),

    /* ======================
       STOCK
    ====================== */
    Text(
      {
        className: `
          product-stock
          ${
            inStock
              ? "in-stock"
              : "out-stock"
          }
        `.trim()
      },
      inStock
        ? `In Stock • ${product.stock} available`
        : "Out of Stock"
    ),

    /* ======================
       META DETAILS
    ====================== */
    Div(
      {
        className:
          "product-meta"
      },

      Detail({
        label: "Brand",
        value:
          product.brand ||
          "Mecus Living"
      }),

      Detail({
        label: "Category",
        value:
          product.category
      }),

      Detail({
        label: "Material",
        value:
          product.material
      }),

      product.color &&
        Detail({
          label: "Color",
          value:
            product.color
        })
    ),

    /* ======================
       SHIPPING
    ====================== */
    product.shipping?.time &&
      Text(
        {
          className:
            "product-shipping"
        },
        `Delivery: ${product.shipping.time}`
      ),

    product.shipping
      ?.freeShipping &&
      Text(
        {
          className:
            "product-free-shipping"
        },
        "✓ Free shipping available"
      ),

    /* ======================
       ACTION
    ====================== */
    CartButton({
      productId:
        product.id,
      variant:
        product.variant,
      onClick: addToCart,
      disabled:
        !inStock
    })
  );
}