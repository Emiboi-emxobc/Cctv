import Div from "../Div.js";

export default function FormGrid({ cols = 2 }, ...children) {
  return Div(
    {
      className: "form-grid",
      style: `grid-template-columns: repeat(${cols}, 1fr);`
    },

    ...children
  );
}