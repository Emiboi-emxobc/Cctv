import Div from "../Div.js";

import BackButton from "../buttons/BackButton.js";

import PageTitle from "./PageTitle.js";
import PageSubtitle from "./PageSubtitle.js";

export default function PageHeader({
  className = "",
  name = "",
  subtitle = "",
  showBack = false,
  action = null
} = {}) {

  const pageTitle =
    name || document.title.split("|")[0].trim();

  return Div(
    {
      className: `page-header ${className}`.trim()
    },

    Div(
      {
        className: "page-header-main"
      },

      showBack && BackButton(),

      Div(
        {
          className: "page-header-text"
        },

        PageTitle({
          text: pageTitle
        }),

        subtitle &&
          PageSubtitle({
            text: subtitle
          })
      )
    ),

    action &&
      Div(
        {
          className: "page-header-action"
        },
        action
      )
  );
}