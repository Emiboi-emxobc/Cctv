import Page from "../components/page/Page.js";
import Div from "../components/Div.js";
import Ul from "../components/Ul.js";

import Feature from "../components/feature/Feature.js";

import ProductGallery from "../components/product/ProductGallery.js";
import ProductInfo from "../components/product/ProductInfo.js";
import ProductGrid from "../components/product/ProductGrid.js";

import DetailCard from "../components/card/DetailCard.js";

import Paragraph from "../components/typography/Paragraph.js";
import Text from "../components/typography/Text.js";

import {
  getProductById,
  getProducts
} from "../data/products/index.js";

export default function ProductPage({
  params = {}
}) {
  const products = getProducts();

  const product = getProductById(
    params.id
  );

  if (!product) {
    return Page(
      {
        className: "product-page"
      },

      Div(
        {
          className:
            "empty-state"
        },

        Text(
          {},
          "Product not found"
        )
      )
    );
  }

  const similarProducts =
    getSimilarProducts(
      products,
      product
    );

  const relatedProducts =
    getRelatedProducts(
      products,
      product
    );

  return Page(
    {
      className:
        "product-page"
    },

    /* ======================
       MAIN PRODUCT
    ====================== */
    Div(
      {
        className:
          "product-main-section"
      },

      ProductGallery(product),
      ProductInfo(product)
    ),

    /* ======================
       PRODUCT DETAILS
    ====================== */
    Feature(
      {
        title:
          "Product Details"
      },

      Div(
        {
          className:
            "product-details-grid"
        },

        DetailCard({
          label: "Brand",
          value:
            product.brand ||
            "Mecus Living"
        }),

        DetailCard({
          label:
            "Material",
          value:
            product.material
        }),

        DetailCard({
          label: "Color",
          value:
            product.color
        }),

        DetailCard({
          label:
            "Category",
          value:
            product.category
        }),

        DetailCard({
          label:
            "Dimensions",
          value:
            formatDimensions(
              product.dimensions
            )
        }),

        DetailCard({
          label:
            "Weight Capacity",
          value:
            product.weightCapacity
        })
      )
    ),

    /* ======================
       FEATURES
    ====================== */
    product.features?.length > 0 &&
      Feature(
        {
          title: "Features"
        },

        Ul(
          {
            className:
              "product-features-list"
          },

          ...product.features.map(
            feature =>
              Paragraph(
                {
                  className:
                    "product-feature-item"
                },
                feature
              )
          )
        )
      ),

    /* ======================
       SHIPPING
    ====================== */
    product.shipping &&
      Feature(
        {
          title:
            "Shipping Information"
        },

        Div(
          {
            className:
              "product-details-grid"
          },

          DetailCard({
            label:
              "Delivery Time",
            value:
              product.shipping.time
          }),

          DetailCard({
            label:
              "Delivery Fee",
            value:
              product.shipping
                .freeShipping
                ? "Free Shipping"
                : `₦${product.shipping.fee.toLocaleString()}`
          })
        )
      ),

    /* ======================
       SIMILAR PRODUCTS
    ====================== */
    similarProducts.length >
      0 &&
      Feature(
        {
          title:
            "Similar Products"
        },

        ProductGrid(
          similarProducts
        )
      ),

    /* ======================
       RELATED PRODUCTS
    ====================== */
    relatedProducts.length >
      0 &&
      Feature(
        {
          title:
            "You May Also Like"
        },

        ProductGrid(
          relatedProducts
        )
      )
  );
}

/* ======================
   HELPERS
====================== */

function formatDimensions(
  dimensions
) {
  if (!dimensions)
    return null;

  return `${dimensions.width} W × ${dimensions.height} H × ${dimensions.depth} D`;
}

function getSimilarProducts(
  products,
  product
) {
  return products
    .filter(
      item =>
        item.id !==
          product.id &&
        item.subCategory ===
          product.subCategory
    )
    .slice(0, 4);
}

function getRelatedProducts(
  products,
  product
) {
  return products
    .filter(
      item =>
        item.id !==
          product.id &&
        (
          item.category ===
            product.category ||
          item.tags?.some(tag =>
            product.tags?.includes(
              tag
            )
          )
        )
    )
    .sort((a, b) => {
      return (
        getTagOverlap(
          b,
          product
        ) -
        getTagOverlap(
          a,
          product
        )
      );
    })
    .slice(0, 4);
}

function getTagOverlap(
  item,
  product
) {
  return (
    item.tags?.filter(tag =>
      product.tags?.includes(
        tag
      )
    ).length || 0
  );
}