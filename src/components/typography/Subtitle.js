import Paragraph from "./Paragraph.js";

export default function Subtitle(
  { className = "", ...props } = {},
  ...children
) {
  return Paragraph(
    {
      className: `subtitle ${className}`,
      ...props
    },
    ...children
  );
}