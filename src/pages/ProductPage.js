import Div from "../components/Div.js";
import Text from "../components/Text.js";
import Ul from '../components/Ul.js';
import Feature from "../components/Feature.js";
import ProductGallery from "../components/product/ProductGallery.js";
import ProductInfo from "../components/product/ProductInfo.js";
import ProductGrid from "../components/ProductGrid.js";
import Paragraph from '../components/Paragraph.js';
import { getProductById, getProducts } from "../data/products/index.js";

// Load CSS once
if (!document.querySelector('link[href="/src/styles/product.css"]')) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/src/styles/product.css";
  document.head.appendChild(link);
}

function DetailCard(label, value) {
  if (!value) return null;
  return Div(
    { className: "product-details-card" },
    Text({ className: "product-details-title" }, `${label}: `),
    Text({ className: "product-details-text" }, value)
  );
}

export default function ProductPage(params) {
  const products = getProducts();
  const product = getProductById(params.params.id);

  if (!product) {
    return Div(
      { className: "product-not-found" },
      Text({}, "Product not found")
    );
  }

  // Related products: same category OR shared tags, sorted by tag overlap
  const relatedProducts = products
    .filter(item => item.id !== product.id && (
      item.category === product.category || 
      item.tags?.some(tag => product.tags?.includes(tag))
    ))
    .sort((a, b) => {
      const aShared = a.tags?.filter(tag => product.tags?.includes(tag)).length || 0;
      const bShared = b.tags?.filter(tag => product.tags?.includes(tag)).length || 0;
      return bShared - aShared;
    })
    .slice(0, 4);

  // Similar products: same subcategory
  const similarProducts = products
    .filter(item => item.id !== product.id && item.subCategory === product.subCategory)
    .slice(0, 4);

  const dimensions = product.dimensions 
    ? `${product.dimensions.width} W × ${product.dimensions.height} H × ${product.dimensions.depth} D`
    : null;

  return Div(
    { className: "page product-page" },

    // Main Product Section
    Div(
      { className: "product-main-section" },
      ProductGallery(product),
      ProductInfo(product)
    ),

    // Product Details Section
    Feature(
      { name: "Product Details", id: "product-details-section" },
      Div(
        { className: "product-details-grid" },
        DetailCard("Brand", product.brand || "Mecus Living"),
        DetailCard("Material", product.material),
        DetailCard("Color", product.color),
        DetailCard("Category", product.category),
        DetailCard("Dimensions", dimensions),
        DetailCard("Weight Capacity", product.weightCapacity)
      )
    ),

    // Features Section - now works with fixed Ul
    product.features?.length > 0 &&
      Feature(
        { name: "Features", id: "product-features-section" },
        Ul(
          { className: "product-features-list" },
          ...product.features.map(feature => 
            Div({ className: "product-feature-item" }, Paragraph({}, feature))
          )
        )
      ),

    // Shipping Section
    product.shipping &&
      Feature(
        { name: "Shipping Information", id: "shipping-section" },
        Div(
          { className: "shipping-card" },
          Div(
            { className: "shipping-item" },
            Paragraph({ className: "shipping-label" }, "Delivery Time"),
            Text({ className: "shipping-value" }, product.shipping.time)
          ),
          Div(
            { className: "shipping-item" },
            Paragraph({ className: "shipping-label" }, "Delivery Fee"),
            Text(
              { className: "shipping-value" },
              product.shipping.freeShipping
                ? "Free Shipping"
                : `₦${product.shipping.fee.toLocaleString()}`
            )
          )
        )
      ),

    // Similar Products
    similarProducts.length > 0 &&
      Feature(
        { name: "Similar Products", id: "similar-products-section" },
        ProductGrid(similarProducts)
      ),

    // Related Products
    relatedProducts.length > 0 &&
      Feature(
        { name: "You may also like", id: "related-products-section" },
        ProductGrid(relatedProducts)
      )
  );
}