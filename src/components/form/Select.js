import { forms } from "../../store/modules/forms.js";
import { _$ } from "../helpers/dom.js";

export default function Select({
  form,
  name,
  options = [],
  value = "",
  className = "select",
  onChange,
  ...props
} = {}) {
  const currentValue =
    form && name
      ? forms.getField(form, name) || value
      : value;

  function handleChange(e) {
    const nextValue = e.target.value;

    if (form && name) {
      forms.setField(form, name, nextValue);
    }

    onChange?.(e);
  }

  return _$(
    "select",
    {
      className,
      value: currentValue,
      onChange: handleChange,
      ...props
    },

    ...options.map(option =>
      _$(
        "option",
        {
          value: option.value,
          selected:
            String(option.value) ===
            String(currentValue)
        },
        option.label
      )
    )
  );
}