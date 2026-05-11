import { _$ } from "../helpers/dom.js";

export default function Button(
  {
    className = "",
    onClick,
    type = "button",
    disabled = false,
    ...props
  } = {},
  ...children
) {
  return _$(
    "button",
    {
      type,
      disabled,
      onClick,
      className: `btn ${className}`.trim(),
      ...props
    },
    ...children
  );
}