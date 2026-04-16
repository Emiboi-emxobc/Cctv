
import Button from "../Button.js";
import Icon from '../icons/Icon.js';
import Text from "../Text.js";
import { Store } from "../../store/store.js";
import {reactive} from '../helpers/reactive.js';


export default function CartIcon() {
  return reactive("cart.items", () => {
    const count = Store.get("cart.items")?.length || 0;

    return Button(
      {
        className: "btn-primary cart-btn icon-btn",
        onClick: () => {
          window.router.navigate("/cart");
        }
      },

      Icon({ name: "shopping-cart cart-icon" }),
      Text({
        className: "cart-count",
        text: `${count}`
      })
    );
  });
}