import Div from "../Div.js";
import Title from "../typography/Title.js";

export default function FormSection({ title }, ...children) {
  return Div(
    { className: "form-section" },

    title && Title(
      { level: 3, className: "form-section-title" },
      title
    ),

    Div(
      { className: "form-section-body" },
      ...children
    )
  );
}