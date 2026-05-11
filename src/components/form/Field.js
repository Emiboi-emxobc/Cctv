import Div from "../Div.js";
import Input from "./Input.js";
import { reactive } from "../../helpers/reactive.js";

export default function Field({
  label,
  form,
  name,
  ...props
}) {
  function errorPath() {
    return `forms.${form}.errors.${name}`;
  }

  return Div(
    { className: "form-field" },

    label &&
      Div(
        { className: "field-label" },
        label
      ),

    Input({
      ...props,
      form,
      name
    }),

    reactive(errorPath(), (error) =>
      error
        ? Div(
            { className: "field-error" },
            error
          )
        : null
    )
  );
}