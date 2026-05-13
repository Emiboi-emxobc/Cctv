import Section from "./Section.js";
import Div from "./Div.js";

import FeatureHeader from "./feature/FeatureHeader.js";

export default function Feature(
  {
    id = "",
    title = "",
    subtitle = "",
    action = null,
    className = ""
  } = {},
  ...children
) {
  return Section(
    {
      id,
      className: `feature ${className}`.trim()
    },

    FeatureHeader({
      title,
      subtitle,
      action
    }),

    Div(
      { className: "feature-content" },
      ...children
    )
  );
}