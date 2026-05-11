import { _$ } from "../helpers/dom.js";

export function CardFooter(
  { className = "", ...props } = {},
  ...children
) {
  return _$(
    "div",
    {
      className: `card-footer ${className}`.trim(),
      ...props
    },
    ...children
  );
}