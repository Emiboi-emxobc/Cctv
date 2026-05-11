import Page from "../components/page/Page.js";
import ProductGrid from "../components/product/ProductGrid.js";
import ShopControl from "../components/shop/ShopControl.js";

import { getProducts } from "../data/products/index.js";
import { filterProducts } from "../helpers/productFilters.js";

export default function ShopPage({ query = {} }) {
  const products = filterProducts(
    getProducts(),
    query
  );
  
  return Page(
    {
      className: "page shop-page",
      title: "Shop Furniture"
    },
    
    ShopControl({ query }),
    
    ProductGrid(products)
  );
}