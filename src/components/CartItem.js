import Div from "./Div.js";
import Img from "./Img.js";
import Text from "./typography/Text.js";
import Button from "./buttons/Button.js";
import { Store } from "../store/index.js";
import Price from './typography/Price.js';
import { reactive } from "../helpers/reactive.js";

export default function CartItem(item) {

  function increase(e) {
    e?.stopPropagation();

    Store.cart.increase(item.id,item.variant)
  }

  function decrease(e) {
    e?.stopPropagation(e);

    Store.cart.decrease(item.id,item.variant);
   
  }
  
  function removeItem(e) {
    e?.stopPropagation(e);

    Store.cart.remove(item.id, item.variant);
  }


   let current = item;

    


function QtyText(item) {
  
 

return reactive("cart.items", (items = []) => {
if (!current) return null;
current = items.find(
  i => i.id === item.id && i.variant === item.variant
 );

  console.log(JSON.stringify(current))
  return Text(         
    { className: "qty-display" 
      
    },
              current?.qty || 0
    )
  });
}
  

  

 
    return Div(
      { className: "cart-item" },

      Img({
        src: current.image,
        className: "cart-item-img",
        alt: current.name
      }),

      Div(
        { className: "cart-item-details" },

        Text(
          { className: "cart-item-name" },
          current.name
        ),

        current.variant &&
          Text(
            { className: "cart-item-variant" },
            current.variant
          ),

        Div(
          { className: "cart-item-row" },

          
          Price({
            amount:current.price,
            className:"cart-item-price"
          }),

          Div(
            { className: "qty-controls" },

            Button(
              { className: "qty-btn", onClick: decrease },
              "−"
            ),
         QtyText(),
            
            Button(
              { className: "qty-btn", onClick: increase },
              "+"
            )
          )
        )
      ),

      Button(
        {
          className: "cart-item-remove",
          onClick: removeItem
        },
        "×"
      )
    );

}