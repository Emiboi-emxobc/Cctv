import Img from "./Img.js";

export default function Thumbnail({
  src = "",
  alt = "",
  active = false,
  className = "",
  ...props
} = {}) {
  return Img({
    src,
    alt,
    className: `
      thumbnail
      ${active ? "active" : ""}
      ${className}
    `.trim(),
    ...props
  });
}