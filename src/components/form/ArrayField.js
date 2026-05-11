import Div from "../Div.js";
import Button from "../buttons/Button.js";
import Input from "./Input.js";
import { forms } from "../../store/modules/forms.js";

export default function ArrayField({
  form,
  name,
  label
}) {

  function getItems() {
    return forms.getField(form, name) || [];
  }

  function addItem() {
    const next = [...getItems(), ""];
    forms.setField(form, name, next);
  }

  function updateItem(index, value) {
    const next = [...getItems()];
    next[index] = value;
    forms.setField(form, name, next);
  }

  return Div(
    { className: "array-field" },

    label && Div({ className: "array-label" }, label),

    ...getItems().map((item, i) =>
      Div(
        { className: "array-row" },

        Input({
          value: item,
          onChange: (val) => updateItem(i, val)
        })
      )
    ),

    Button({
      onClick: addItem,
      text: "+ Add"
    })
  );
}