import Button from "../buttons/Button.js";
import { cart } from "../../store/modules/cart.js";
import Icon from ".././icons/Icon.js"
    

export default function CartRemoveButton({
  productId,
  variant
}) {
  function remove(e) {
    e?.stopPropagation();
    cart.remove(productId, variant);
  }

  return Button(
    {
      className: "remove-icon",
      onClick: remove
    },
   Icon({
     name:"times"
   })
  );
}