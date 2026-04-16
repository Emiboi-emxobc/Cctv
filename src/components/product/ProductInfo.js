import Div from "../Div.js"
import Text from "../Text.js"
import CartButton from '../CartButton.js'
import { Store } from "../../store/store.js"
import PriceRow from '../PriceRow.js';

export default function ProductInfo(product){

  const inStock = product.stock > 0;
  const hasDiscount = product.promo && product.promo < product.price;

  function addToCart(){
    if (!inStock) return;

    Store.update("cart.items", items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i =>
          i.id === product.id? {...i, qty: (i.qty || 1) + 1 } : i
        );
      }
      return [
     ...items,
        {
          id: product.id,
          name: product.name,
          price: hasDiscount? product.promo : product.price,
          image: product.images?.[0],
          qty: 1
        }
      ];
    });
  }

  return Div(
    { className:"product-info" },

    Text({ className:"product-title" }, product.name),

    // Use PriceRow now - replaces the whole Div block
    PriceRow({ product, className: "product-price-block" }),

    Text(
      { className: `product-stock ${inStock? 'in-stock' : 'out-stock'}` },
      inStock? `In Stock • ${product.stock} available` : "Out of Stock"
    ),

    product.shipping?.time &&
      Text(
        { className:"product-shipping" },
        `Delivery: ${product.shipping.time}`
      ),

    product.shipping?.freeShipping &&
      Text({ className:"product-free-shipping" }, "✓ Free shipping available"),

    CartButton({
      productId: product.id, // was missing
      onClick: addToCart,
      disabled:!inStock
    })
  )
}