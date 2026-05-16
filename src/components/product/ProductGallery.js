import Div from "../Div.js";
import Img from "../Img.js";

import { reactive } from "../../helpers/reactive.js";
import { ui } from "../../store/modules/ui.js";

export default function ProductGallery(
  product
) {
  if (!product) return null;

  const images =
    product.images || [];

  const mainImage =
    images[0];

  const key =
    product.id;

  return Div(
    {
      className:
        "product-gallery"
    },

    Div(
      {
        className:
          "product-preview"
      },

      reactive(
        `ui.previewImage.${key}`,
        () =>
          Img({
            src:
              ui.getPreviewImage(
                key
              ) || mainImage,

            className:
              "product-main-image",

            alt:
              product.name
          })
      )
    ),

    images.length > 1 &&
      Div(
        {
          className:
            "product-thumbnails"
        },

        ...images.map(src =>
          Img({
            src,
            className:
              "product-thumb",

            alt:
              product.name,

            onClick: () =>
              ui.previewImage(
                key,
                src
              )
          })
        )
      )
  );
}