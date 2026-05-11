import Card from "../card/Card.js";
import Img from "../media/Img.js";
import Paragraph from "../typography/Paragraph.js";
import Div from '../Div.js';

export default function ProductSuggestion(product) {
  return Card(
    {
      className: "search-item",
      onClick: () =>
        window.router.navigate(
          `/product/${product.id}`
        )
    },

   Div({},
    Img({
   src: product.images[0],
   alt: product.name,
   className: "search-item-img"
      })
   ),

    Div(
      { className: "search-item-info" },

      Paragraph(
        { className: "search-item-title" },
        product.name
      ),

      Paragraph(
        { className: "search-item-subtitle" },
        product.category || ""
      )
    )
  );
}