import Section from "../Section.js";
import Div from "../Div.js";
import PageHeader from "./PageHeader.js";

export default function Page(
  {
    title = "",
    subtitle = "",
    showHeader = true,
    className = ""
  } = {},
  ...children
) {
  return Section(
    {
      className: `page ${className}`.trim()
    },
    
    showHeader &&
    (title || subtitle) &&
    PageHeader({
      title,
      subtitle
    }),
    
    Div(
      {
        className: "page-content"
      },
      ...children
    )
  );
}