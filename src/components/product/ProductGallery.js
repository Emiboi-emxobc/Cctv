import Div from "../Div.js";
import Img from "../Img.js";
import { reactive } from "../helpers/reactive.js";
import { Store } from "../../store/store.js";

export default function ProductGallery(product) {

  const mainImage = product.images?.[0];

  return reactive("ui.previewImage", () => {

    const preview =
      Store.get("ui.previewImage") || mainImage;

    return Div(
      { className: "product-gallery" },

      Div(
        { className: "product-preview" },

        Img({
          src: preview,
          className: "product-main-image"
        })
      ),

      Div(
        { className: "product-thumbnails" },

        ...product.images.map(src =>
          Img({
            src,
            className: "product-thumb",
            onClick: () =>
              Store.set("ui.previewImage", src)
          })
        )
      )
    );
  });
}