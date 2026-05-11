import Div from "../Div.js";
import Input from "./Input.js";
import Img from "../Img.js";
import { reactive } from "../../helpers/reactive.js";
import { forms } from "../../store/modules/forms.js";

export default function ImageUploader({
  form = "product",
  name = "images"
} = {}) {
  function handleSelect(selected) {
    const current =
      forms.getField(form, name) || [];

    const next = [...current, ...selected];

    forms.setField(form, name, next);
  }

  return Div(
    {},

    Input({
      type: "file",
      multiple: true,
      accept: "image/*",
      onChange: handleSelect
    }),

    reactive(
      `forms.${form}.data.${name}`,
      (files = []) =>
        Div(
          { className: "preview-grid" },

          ...files.map((file) =>
            Img({
              src: URL.createObjectURL(file),
              className: "preview-img"
            })
          )
        )
    )
  );
}