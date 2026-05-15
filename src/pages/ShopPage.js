import Page from "../components/page/Page.js";
import Feature from "../components/feature/Feature.js";
import ProductGrid from "../components/product/ProductGrid.js";
import SecondaryButton from "../components/buttons/SecondaryButton.js";
import GhostButton from "../components/buttons/GhostButton.js";
import ShopControl from "../components/shop/ShopControl.js";

import { getProducts } from "../data/products/index.js";
import { groupProducts } from "../helpers/groupProduct.js";
import { filterProducts } from "../helpers/productFilters.js";
import { rankProducts } from "../helpers/ranking/rankProducts.js";

export default function ShopPage({
  query = {}
}) {
  let products = getProducts();

  // rank first
  products = rankProducts(products);

  // then filter
  products = filterProducts(products, query);

  const featured = products.filter(
    product => product.featured
  );

  const trending = products.filter(
    product => product.trending
  );

  const categories = groupProducts(
    products,
    "category"
  );

  return Page(
    {
      className: "shop-page"
    },

    ShopControl({ query }),

    Feature(
      {
        title: "Featured",
        action: GhostButton(
          {
            className: "action-btn btn-sm"
          },
          "See all"
        )
      },
      ProductGrid(featured.slice(0, 4))
    ),

    Feature(
      {
        title: "Trending",
        action: GhostButton(
          {
            className: "action-btn btn-sm"
          },
          "See all"
        )
      },
      ProductGrid(trending.slice(0, 4))
    ),

    ...Object.entries(categories).map(
      ([name, items]) =>
        Feature(
          {
            title:
              name.charAt(0).toUpperCase() +
              name.slice(1),

            action: GhostButton(
              {
                className: "action-btn btn-sm"
              },
              "See all"
            )
          },

          ProductGrid(items.slice(0, 4))
        )
    )
  );
}