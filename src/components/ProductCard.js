import ViewButton from './ViewButton.js';
import IncreaseButton from './IncreaseButton.js';
import PrimaryButton from './PrimaryButton.js';
import CartButton from './CartButton.js';
import Div from "./Div.js";
import Img from "./Img.js";
import Text from "./Text.js";
import ProductName from './ProductName.js';
import PriceRow from './PriceRow.js'; // add this
import Icon from './icons/Icon.js';
import Card from './Card.js';
import { Router } from "../router/md-router.js";
import { Store } from "../store/store.js";
import { reactive } from "./helpers/reactive.js";

export default function ProductCard(product) {
  return reactive("cart.items", () => {
    const { id, name, price, promo, images, stock } = product;

    const cartItems = Store.get("cart.items") || [];
    const cartItem = cartItems.find(item => item.id === id);
    const qty = cartItem?.qty || 0;
    const inStock = stock > 0;
    const hasDiscount = promo && promo < price;
    const added = qty > 0;

    function addToCart(e) {
      e?.stopPropagation();
      if (!inStock) return;

      Store.update("cart.items", (items = []) => {
        const existing = items.find(item => item.id === id);

        if (existing) {
          return items.map(item =>
            item.id === id? {...item, qty: item.qty + 1 } : item
          );
        }

        return [
      ...items,
          {
            id,
            name,
            price: hasDiscount? promo : price,
            image: images?.[0],
            qty: 1
          }
        ];
      });
    }

    function openProduct(e) {
      e?.stopPropagation();
      Router.navigate(`/product/${id}`);
    }

    function handleOrder(e) {
      e?.stopPropagation();
      addToCart(e);
      Router.navigate('/cart');
    }

    return Card(
      { className: "product-card", onClick: openProduct },

      Div(
        { className: "product-image-wrap" },
        Img({
          src: images?.[0] || "/placeholder.jpg",
          className: "product-img",
          alt: name
        }),

        // Keep corner badge on image - PriceRow puts badge inline with price
        hasDiscount && Div(
          { className: "discount-badge-corner" },
          `${Math.round((1 - promo/price) * 100)}% OFF`
        ),

        Div(
          { className: "card-top-actions" },
          ViewButton(openProduct)
        )
      ),

      Div(
        { className: "card-content" },
        Div(
          { className: "product-info" },
          ProductName(name),

          // Replace manual price Div with PriceRow
          PriceRow({ product }),

       !inStock && Text({ className: "out-stock" }, "Out of stock")
        ),

        Div(
          { className: "product-actions" },
       !added
         ? CartButton({
                productId: id,
                onClick: addToCart,
                disabled:!inStock
              })
            : IncreaseButton(id),

       !added && inStock
         ? PrimaryButton(
                {
                  className: "btn-primary",
                  onClick: handleOrder
                },
                Icon({ name: "shopping-bag" }),
                "Buy Now"
              )
            : null
        )
      )
    );
  });
}