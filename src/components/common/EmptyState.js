import Div from "../Div.js";
import Icon from "../icons/Icon.js";
import Title from "../typography/Title.js";
import Paragraph from "../typography/Paragraph.js";

export default function EmptyState({
  icon = "inbox",
  title = "Nothing here yet",
  subtitle = "",
  action = null,
  className = ""
} = {}) {
  return Div(
    {
      className: `empty-state ${className}`.trim()
    },

    icon &&
      Div(
        { className: "empty-state-icon-wrap" },
        Icon({
          name: icon,
          className: "empty-state-icon"
        })
      ),

    Title({
      text: title,
      className: "empty-state-title"
    }),

    subtitle &&
      Paragraph({
        text: subtitle,
        className: "empty-state-subtitle"
      }),

    action &&
      Div(
        { className: "empty-state-action" },
        action
      )
  );
}