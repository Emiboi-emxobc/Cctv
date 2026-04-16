import Div from "../components/Div.js"
import Text from "../components/texts/Text.js"
import Title from "../components/texts/Title.js";
import ProductGrid from '../components/products/ProductGrid.js';
import CartItem from "../components/products/CartItem.js"
import Button from "../components/buttons/Button.js"
import Paragraph from "../components/texts/Paragraph.js"

import { Store } from "../store/store.js"

export default function CartPage(){

  const items = Store.get("cart.items") || []

  const total = items.reduce((sum,item)=>sum+item.price,0)

  return Div(
    { className:"page cart-page" },
     
        
      Div({
        className:"product-hero cart-hero"
      },
        Title({
          level:1, 
          className:"hero-title cart-hero-title",
          text:"Your cart"
        })
      ),
 
    ProductGrid(items),
    Div(
      { className:"cart-summary" },

      Text({className:"price"}, `Total: ₦${total}`),

      Button(
        {
          onClick: () => alert("Checkout coming soon")
        },
        "Proceed to Checkout"
      )

    )

  )

}