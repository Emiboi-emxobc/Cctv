import Div from "../Div.js";
import {reactive} from '../.././helpers/reactive.js';

import { cart } from "../.././store/modules/cart.js";
import CartEmpty from "./CartEmpty.js";
import CartItem from './CartItem.js';
export default function CartList() {
  return reactive("cart.items", () => {
    const items = cart.getItems();

    if (!items.length) return CartEmpty();

    return Div(
      { className: "cart-items" },
      ...items.map(item => CartItem(item))
    );
  });
}