import Title from "../typography/Title.js";
import Card from "../card/Card.js";
import Button from "../buttons/Button.js";
import Price from "../typography/Price.js";
import Detail from "../common/Detail.js";

import { reactive } from "../../helpers/reactive.js";
import { cart } from "../../store/modules/cart.js";

export default function CartSummary() {
  return reactive("cart.items", () => {
    if (cart.isEmpty()) return null;

    const { total } = cart.getSummary();
    const shipping = 20000;

    return Card(
      { className: "cart-summary" },

      Card.Header(
        {},
        Title({
          level: 3,
          text: "Order Summary"
        })
      ),

      Card.Body(
        {},

        Detail({
          label: "Subtotal",
          value: Price({ amount: total })
        }),

        Detail({
          label: "Shipping",
          value: Price({ amount: shipping })
        }),

        Detail({
          label: "Total",
          value: Price({ amount: total + shipping }),
          highlight: true
        })
      ),

      Card.Footer(
        {},

        Button(
          {
            className: "btn-primary checkout-btn"
          },
          "Proceed to Checkout"
        ),

        Button(
          {
            className: "btn-secondary continue-btn",onClick:()=>Router.navigate("/shop")
          },
          "Continue Shopping"
        )
      )
    );
  });
}