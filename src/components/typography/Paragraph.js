import { _$ } from "../helpers/dom.js";

export default function Paragraph(
  { className = "", children = [], ...props } = {},
  ...rest
) {
  return _$(
    "p",
    {
      className: ["paragraph", className].filter(Boolean).join(" "),
      ...props
    },
    ...children,
    ...rest
  );
}