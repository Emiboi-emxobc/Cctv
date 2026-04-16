import Div from "../components/Div.js";
import Text from "../components/Text.js";
import PageHeader from "../components/PageHeader.js";
import ProductCard from "../components/ProductCard.js";
import SearchBar from "../components/layout/SearchBar.js";
import Button from "../components/Button.js";
import Feature from '../components/Feature.js';
import {
  getProducts,
  getProductsByCategory,
  searchProducts
} from "../data/products/index.js";

export default function ShopPage({ query }) {
  let products = getProducts();

  const selectedCategory = query?.category || "all";
  const searchQuery = query?.search || "";
  const sortBy = query?.sort || "default";

  // Category filter
  if (selectedCategory !== "all") {
    products = getProductsByCategory(selectedCategory);
  }

  // Search filter
  if (searchQuery) {
    products = products.filter((product) => {
      const text = `
        ${product.name}
        ${product.description}
        ${product.category}
        ${product.subCategory}
        ${product.tags?.join(" ")}
        ${product.color}
        ${product.material}
      `.toLowerCase();

      return text.includes(searchQuery.toLowerCase());
    });
  }

  // Sorting
  switch (sortBy) {
    case "low-price":
      products.sort((a, b) => a.promo - b.promo);
      break;

    case "high-price":
      products.sort((a, b) => b.promo - a.promo);
      break;

    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;

    case "newest":
      products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      break;

    case "popular":
      products.sort((a, b) => b.likes - a.likes);
      break;

    default:
      break;
  }

  const categories = [
    "all",
    "sofa",
    "chair",
    "desk",
    "bed",
    "table"
  ];

  function updateQuery(newQuery = {}) {
    const params = new URLSearchParams({
      ...(selectedCategory !== "all" && {
        category: selectedCategory
      }),
      ...(searchQuery && {
        search: searchQuery
      }),
      ...(sortBy !== "default" && {
        sort: sortBy
      }),
      ...newQuery
    });

    window.router.navigate(`/shop?${params.toString()}`);
  }

  return Feature(
    { className: "page shop-page",name:"Shop furnitures "},


    // Shop Controls
    Div(
      { className: "shop-controls" },

   SearchBar(),
      // Categories
      Div(
        { className: "shop-categories" },

        ...categories.map((category) =>
          Button(
            {
              className: `shop-category-btn ${
                selectedCategory === category ? "active" : ""
              }`,
              onClick: () => {
                updateQuery({
                  category:
                    category === "all" ? "" : category
                });
              }
            },
            category.charAt(0).toUpperCase() + category.slice(1)
          )
        )
      ),

      // Sorting
      Div(
        { className: "shop-sort" 

        ,html:`
          <select class="shop-sort-select">
            <option value="default" ${
              sortBy === "default" ? "selected" : ""
            }>
              Sort By
            </option>

            <option value="low-price" ${
              sortBy === "low-price" ? "selected" : ""
            }>
              Lowest Price
            </option>

            <option value="high-price" ${
              sortBy === "high-price" ? "selected" : ""
            }>
              Highest Price
            </option>

            <option value="rating" ${
              sortBy === "rating" ? "selected" : ""
            }>
              Top Rated
            </option>

            <option value="popular" ${
              sortBy === "popular" ? "selected" : ""
            }>
              Most Popular
            </option>

            <option value="newest" ${
              sortBy === "newest" ? "selected" : ""
            }>
              New Arrivals
            </option>
          </select>
        `
        }
      )
      
    ),

    // Results Info
    Div(
      { className: "shop-results-info" },
      Text(
        { className: "shop-results-text" },
        `${products.length} product${
          products.length !== 1 ? "s" : ""
        } found`
      )
    ),

    // Empty State
    products.length === 0
      ? Div(
          { className: "shop-empty-state" },
          Text(
            { className: "shop-empty-title" },
            "No products found"
          ),
          Text(
            { className: "shop-empty-text" },
            "Try changing your search or filters."
          )
        )
      : Div(
          { className: "product-grid" },
          ...products.map((product) => ProductCard(product))
        )
  );
}