import Div from "../Div.js";
import Text from "../typography/Text.js";

export default function Detail({
  label = "",
  value = "",
  className = "",
  highlight = false
} = {}) {
  return Div(
    {
      className: `
        detail-row
        ${highlight ? "detail-highlight" : ""}
        ${className}
      `.trim()
    },

    Text(
      { className: "detail-label" },
      label
    ),

    typeof value === "string"
      ? Text(
          { className: "detail-value" },
          value
        )
      : value
  );
}