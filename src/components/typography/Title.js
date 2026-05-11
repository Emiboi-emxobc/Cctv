import { _$ } from "../helpers/dom.js";

export default function Title({
  level = 2,
  className = "",
  
  ...props
} = {},text) {
  const tag = `h${level}`;

  return _$(
    tag,
    {
      className: `title ${className}`.trim(),
      ...props
    },
    text
  );
}
