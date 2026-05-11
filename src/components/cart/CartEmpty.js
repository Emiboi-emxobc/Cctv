import Div from "../Div.js";
import Title from "../typography/Title.js";
import Paragraph from "../typography/Paragraph.js";
import Button from "../buttons/Button.js";

export default function CartEmpty() {
  return Div(
    { className: "cart-empty" },

    Title({
      level: 2,
      text: "Your cart is empty"
    }),

    Paragraph({
      text: "No stress, your future best picks are waiting."
    }),

    Button(
      {
        className: "btn-primary",
        onClick: () => window.router.navigate("/shop")
      },
      "Start Shopping"
    )
  );
}