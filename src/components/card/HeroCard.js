import Div from "../Div.js";
import Title from "../typography/Title.js";
import Paragraph from "../typography/Paragraph.js";
import PrimaryButton from "../buttons/PrimaryButton.js";

export default function HeroCard({
  title = "",
  subtitle = "",
  buttonText = "Explore",
  href = "/shop"
}) {
  return Div(
    { className: "hero-card" },

    Div(
      { className: "hero-card-content" },

      Title({
        level: 1,
        className: "hero-title",
        text: title
      }),

      Paragraph({
        className: "hero-tagline",
        text: subtitle
      }),

      PrimaryButton(
        {
          className: "hero-btn",
          onClick: () =>
            window.router.navigate(href)
        },
        buttonText
      )
    )
  );
}