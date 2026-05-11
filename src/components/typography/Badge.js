import { _$ } from "../helpers/dom.js";

export default function Badge(
  { className = "", ...props } = {},
  ...children
) {
  return _$(
    "span",
    {
      className: `badge ${className}`.trim(),
      ...props
    },
    ...children
  );
}