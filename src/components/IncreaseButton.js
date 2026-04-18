import SecondaryButton from "./SecondaryButton.js";
import PrimaryButton from "./PrimaryButton.js";
import Icon from "./icons/Icon.js";
import Div from './Div.js';
import Text from "./Text.js";
import { Store } from "../store/store.js";
import { reactive } from './helpers/reactive.js';

export default function IncreaseButton(productId) {

  function increase(e) {
    e.stopPropagation();

    Store.update("cart.items", (items = []) => {
      return items.map(item => {
        if (item.id === productId) {
          return {
           ...item,
            qty: (item.qty || 0) + 1 // was quantity
          };
        }
        return item;
      });
    });
  }

  function decrease(e) {
    e.stopPropagation();

    Store.update("cart.items", (items = []) => {
      return items
        .map(item => {
          if (item.id === productId) {
            return {
             ...item,
              qty: (item.qty || 1) - 1 // was quantity
            };
          }
          return item;
        })
        .filter(item => item.qty > 0); // was item.quantity
    });
  }

  return reactive("cart.items", () => {
    const items = Store.get("cart.items") || [];
    const currentItem = items.find(item => item.id === productId);
    const qty = currentItem?.qty || 0; // was quantity

    // If qty is 0, this button shouldn't render - ProductCard handles that
    if (qty === 0) return null;

    return Div(
      { className: "increase-btn" },
      
      SecondaryButton(
        {
          className: "decrease-btn",
          onClick: decrease
        },
        Icon({ name: "minus" })
      ),

      Text(
        { className: "quantity-text" },
        qty
      ),

      PrimaryButton(
        {
          className: "increase-btn-add",
          onClick: increase
        },
        Icon({ name: "plus" })
      )
    );
  });
}