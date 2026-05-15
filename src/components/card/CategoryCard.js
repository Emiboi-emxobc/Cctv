import Div from "../Div.js";
import Img from "../Img.js";
import Title from "../typography/Title.js";

export default function CategoryCard({
  name,
  image,
  href = "/shop"
}) {
  return Div(
    {
      className: "category-card",
      onClick: () =>
        window.router.navigate(
          `${href}?category=${name}`
        )
    },

    Img({
      src: image,
      className: "category-image",
      alt: name
    }),

    Div(
      { className: "category-overlay" },

      Title({
        level: 4,
        className: "category-label",
        text:
          name.charAt(0).toUpperCase() +
          name.slice(1)
      })
    )
  );
}