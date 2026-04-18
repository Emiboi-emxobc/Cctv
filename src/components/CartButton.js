import Button from './Button.js';
import Icon from "./icons/Icon.js";
import { reactive } from './helpers/reactive.js';
import { Store } from '../store/store.js';

export default function CartButton({ 
  productId, 
  onClick, 
  selector = "cart.items" 
}) {
  return reactive(selector, (items = []) => {

    const inCart = items.some(item => item?.id === productId);

    const handleClick = inCart
      ? () => Store.navigate('/cart')
      : onClick;

    return Button(
      {
        onClick: handleClick,
        className: inCart 
          ? "btn-secondary in-cart" 
          : "btn-secondary",
        disabled: false,
        "aria-pressed": inCart
      },
      Icon({ name: inCart ? "check" : "shopping-cart" }),
      inCart ? "View in Cart" : "Add to Cart"
    );
  });
}