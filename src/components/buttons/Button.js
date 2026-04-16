import { _$ } from "../helpers/dom.js";

export default function Button(
  { className = "btn", onClick, ...props } = {},
  ...children
){

  return _$(
    "button",
    {
      className:`btn ${className}`,
      onClick,
      ...props
    },
    ...children
  );

}