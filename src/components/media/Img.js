import { _$ } from "../helpers/dom.js";

export default function Img({
  src = "",
  alt = "",
  className = "",
  lazy = true,
  fallback = "",
  ...props
} = {}) {
  
  function handleError(e) {
    if (!fallback) return;
    e.target.src = fallback;
  }
  
  return _$(
    "img",
    {
      src,
      alt,
      loading: lazy ? "lazy" : "eager",
      className: `img ${className}`.trim(),
      onError: handleError,
      ...props
    }
  );
}