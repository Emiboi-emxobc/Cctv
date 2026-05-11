import Div from "../Div.js";
import Text from "../typography/Text.js";
import Title from "../typography/Title.js";
import Card from "../card/Card.js";
import Button from "../buttons/Button.js";
import { reactive } from "../.././helpers/reactive.js";
import { cart } from "../.././store/modules/cart.js";
import { formatPrice } from "../.././helpers/formatPrice.js";
import Price from '../typography/Price.js';
export default function CartSummary(product) {
  return reactive("cart.items", () => {
    if (cart.isEmpty()) return null;

    const { total } = cart.getSummary();

    return Card(
      { className: "cart-summary" },

      Card.Header({},
        Title({
        level: 3,
        text: "Order Summary"
      }),

      ),
      Card.Body({},   Div(
        { className: "summary-row" },
        Text({}, "Subtotal"),
        Text({}, formatPrice(total))
      ),

      Div(
        { className: "summary-row" },
        Text({}, "Shipping"),
        Text({}, Price({amount:20000}))
      ),

      Div({ className: "divider" }),

      Div(
        { className: "summary-total" },
        Text({}, "Total"),
        Text({}, formatPrice(total))
      ),),

      Card.Footer({},Button(
        {
          className: "btn-primary checkout-btn",
          onClick: () => window.router.navigate("/checkout")
        },
        "Proceed to Checkout"
      ),

      Button(
        {
          className: "btn-secondary",
          onClick: () => window.router.navigate("/shop")
        },
        "Continue Shopping"
      ))
    );
  });
}