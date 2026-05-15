import Page from "../components/page/Page.js";
import Div from "../components/Div.js";
import Feature from "../components/feature/Feature.js";
import ProductGrid from "../components/product/ProductGrid.js";

import HeroCard from "../components/card/HeroCard.js";
import CategoryCard from "../components/card/CategoryCard.js";

import { getProducts } from "../data/products/index.js";
import { groupProducts } from "../helpers/groupProduct.js";

export default function HomePage() {
  const products = getProducts();

  const featured = products
    .filter(product => product.featured)
    .slice(0, 4);

  const categories = Object.entries(
    groupProducts(products, "category")
  );

  return Page(
    {
      className: "home-page"
    },

    /* =========================
       HERO
    ========================= */
    HeroCard({
      title: "Premium Furniture For Modern Living",
      subtitle:
        "Discover handcrafted furniture designed for comfort, beauty, and timeless spaces.",
      buttonText: "Shop Now",
      href: "/shop"
    }),

    /* =========================
       CATEGORIES
    ========================= */
    Feature(
      {
        title: "Browse Categories"
      },

      Div(
        {
          className: "category-grid"
        },

        ...categories.map(([name, items]) =>
          CategoryCard({
            name,
            image:
              items?.[0]?.images?.[0] ||
              "/placeholder.jpg",
            href: "/shop"
          })
        )
      )
    ),

    /* =========================
       FEATURED PRODUCTS
    ========================= */
    Feature(
      {
        title: "Featured Products"
      },

      ProductGrid(featured)
    )
  );
}