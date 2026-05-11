import Div from "../Div.js";
import { forms } from "../../store/modules/forms.js";

export default function TextArea({
  name,
  form,
  value,
  onChange,
  ...rest
}) {

  function handleInput(e) {
    const val = e.target.value;

    if (onChange) return onChange(val);

    if (form && name) {
      forms.setField(form, name, val);
    }
  }

  const currentValue =
    value ?? (form && name ? forms.getField(form, name) : "");

  return {
    tag: "textarea",
    value: currentValue,
    onInput: handleInput,
    ...rest
  };
}