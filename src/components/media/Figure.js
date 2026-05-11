import { _$ } from "../helpers/dom.js";
import Img from "./Img.js";
import Paragraph from "../typography/Paragraph.js";

export default function Figure(
  {
    src = "",
    alt = "",
    caption = "",
    className = "",
    imgClassName = "",
    ...props
  } = {}
) {
  return _$(
    "figure",
    {
      className: `figure ${className}`.trim(),
      ...props
    },

    Img({
      src,
      alt,
      className: imgClassName
    }),

    caption &&
      Paragraph(
        { className: "figure-caption" },
        caption
      )
  );
}