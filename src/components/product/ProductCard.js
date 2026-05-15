import Div from "../Div.js";
import Img from "../Img.js";
import Text from "../typography/Text.js";
import Card from "../card/Card.js";
import PrimaryButton from "../buttons/PrimaryButton.js";
import GhostButton from "../buttons/SecondaryButton.js";
import CartButton from "../buttons/CartButton.js";
import Icon from "../icons/Icon.js";
import ProductName from "./ProductName.js";
import PriceRow from "./PriceRow.js";
import CartQty from "../cart/CartQty.js";

import { cart } from "../../store/modules/cart.js";
import { reactive } from "../../helpers/reactive.js";

/* =========================
   STATE MACHINE
========================= */

const ProductState = {
  OUT: "out",
  FRESH: "fresh",
  ACTIVE: "active"
};

function getProductState({ inStock, existing }) {
  if (!inStock) return ProductState.OUT;
  if (existing) return ProductState.ACTIVE;
  return ProductState.FRESH;
}

/* =========================
   ACTION RENDERER
========================= */

function renderActions(state, { id, product, addToCart, buyNow, openProduct }) {
  if (state === ProductState.OUT) return null;

  if (state === ProductState.ACTIVE) {
    return Div(
      { className: "product-actions product-in-cart-actions" },
      GhostButton({
        className: "view-product",
        onClick: openProduct
      },
        Icon({ name: "arrow-right" }),
        "View"
      ),

      CartQty({
        productId: id,
        compact: true
      }),

      
    );
  }

  return Div(
    { className: "product-actions product-not-in-cart-actions" },

    PrimaryButton({
      className: "buy-now",
      onClick: buyNow
    },
      Icon({ name: "shopping-bag" }),
      "Buy now"
    ),

    CartButton({
      onClick: addToCart
    })
  );
}

/* =========================
   PRODUCT CARD
========================= */

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

    const state = getProductState({ inStock, existing });

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
        className: `product-card ${state}`,
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

        state === ProductState.OUT &&
          Text(
            { className: "product-stock-status" },
            "Out of stock"
          )
      ),

      renderActions(state, {
        id,
        product,
        addToCart,
        buyNow,
        openProduct
      })
    );
  });
}