import Img from "./Img.js";

export default function Avatar({
  src = "",
  alt = "Avatar",
  size = "md",
  className = "",
  ...props
} = {}) {
  return Img({
    src,
    alt,
    className: `avatar avatar-${size} ${className}`.trim(),
    ...props
  });
}