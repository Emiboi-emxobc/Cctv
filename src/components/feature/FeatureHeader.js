import Div from "../Div.js";
import Title from "../typography/Title.js";
import Paragraph from "../typography/Paragraph.js";

export default function FeatureHeader({
  title = "",
  subtitle = "",
  action = null,
  className = ""
} = {}) {
  return Div(
    {
      className: `header feature-header ${className}`.trim()
    },

    Div(
      { className: " feature-header-text" },

      title &&
        Title(
          {
            level: 2,
            className: "feature-title"
          },
          title
        ),

      subtitle &&
        Paragraph(
          {
            className: "feature-subtitle"
          },
          subtitle
        )
    ),

    action &&
      Div(
        { className: "feature-action" },
        action
      )
  );
}