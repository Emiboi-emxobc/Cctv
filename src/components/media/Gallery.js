import Div from "../Div.js";
import Img from "./Img.js";
import Thumbnail from "./Thumbnail.js";

export default function Gallery({
  images = [],
  active = 0
} = {}) {
  const current = images[active] || images[0];

  return Div(
    { className: "gallery" },

    Img({
      src: current,
      className: "gallery-main-img"
    }),

    Div(
      { className: "gallery-thumbs" },

      ...images.map((image, index) =>
        Thumbnail({
          src: image,
          active: index === active
        })
      )
    )
  );
}