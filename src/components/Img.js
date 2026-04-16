import { _$ } from "./helpers/dom.js";

export default function Img(
  { src = "", alt = "", className = "", ...props } = {}
){

  return _$(
    "img",
    {
      src,
      alt,
      className,
      ...props
    }
  );

}