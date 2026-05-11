import { _$ } from "../helpers/dom.js";

export function  CardBody(
  { className = "", ...props } = {},
  ...children
) {
  return _$(
    "div",
    {
      className: `card-body ${className}`.trim(),
      ...props
    },
    ...children
  );
}