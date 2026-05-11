import { _$ } from "../helpers/dom.js";

export default function Label(
  { className = "", ...props } = {},
  ...children
) {
  return _$(
    "label",
    {
      className: `label ${className}`.trim(),
      ...props
    },
    ...children
  );
}