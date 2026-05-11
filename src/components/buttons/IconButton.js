import Button from "./Button.js";

export default function IconButton(
  { icon, className = "", ...props } = {}
) {
  return Button(
    {
      className: `icon-btn ${className}`.trim(),
      ...props
    },
    icon
  );
}