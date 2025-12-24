/*image.js USAGE

image("pic.png", "rounded-lg", "profile pic");
image({ src: "pic.png", className: "rounded", alt: "pic" });

*/

import { _$ } from "./dom.js";

export function image(...args) {
  // Object style
  if (typeof args[0] === "object") {
    const { src = "", className = "", alt = "" } = args[0];
    return _$( "img", { src, className, alt });
  }

  // Shorthand
  const [src = "", className = "", alt = ""] = args;
  return _$( "img", { src, className, alt });
}