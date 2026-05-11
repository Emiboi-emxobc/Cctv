import ProductCard from './ProductCard.js';
import Div from '../Div.js';
export default function ProductGrid(items){
   
   return Div(
        { className: "product-grid" },
        ...items.map(item => ProductCard(item))
      )
}