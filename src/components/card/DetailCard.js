import Div from "../Div.js";
import Title from "../typography/Title.js";
import Text from "../typography/Text.js";

export default function DetailCard({
  label = "",
  value = "",
  className = "",
  highlight = false
} = {}) {
  return Div(
    {
      className: `
        detail-card
        ${
          highlight
            ? "detail-card-highlight"
            : ""
        }
        ${className}
      `.trim()
    },

    label &&
      Title({
        level: 5,
        className:
          "detail-card-label",
        text: label
      }),

    typeof value ===
    "string"
      ? Text(
          {
            className:
              "detail-card-value"
          },
          value
        )
      : value
  );
}