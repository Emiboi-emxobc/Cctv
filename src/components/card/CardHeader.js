import { _$ } from "../helpers/dom.js";

export function CardHeader(
  { className = "", ...props } = {},
  ...children
) {
  return _$(
    "div",
    {
      className: `card-header ${className}`.trim(),
      ...props
    },
    ...children
  );
}