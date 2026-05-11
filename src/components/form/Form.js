import Div from "../Div.js";
import {_$} from '../helpers/dom.js';
import { forms } from "../../store/modules/forms.js";

export default function Form({
  name,
  schema = {},
  onSubmit
}, ...children) {

  function handleSubmit(e) {
    e.preventDefault();

    const data = forms.get(name);

    const errors = validate(schema, data);

    forms.setErrors(name, errors);

    if (hasErrors(errors)) return;

    forms.set(`forms.${name}.submitting`, true);

    Promise.resolve(onSubmit?.(data))
      .finally(() => {
        forms.set(`forms.${name}.submitting`, false);
      });
  }

  return _$("form",
    { className: "form-wrapper",

    
      
      onSubmit: handleSubmit
    },

    ...children
  );
}

function validate(schema, data) {
  const errors = {};

  for (const key in schema) {
    const rules = schema[key];
    const value = getValue(data, key);

    if (rules.required && isEmpty(value)) {
      errors[key] = "Required";
    }

    if (rules.min != null && value < rules.min) {
      errors[key] = `Minimum is ${rules.min}`;
    }
  }

  return errors;
}

function getValue(obj, path) {
  return path.split(".").reduce((acc, k) => acc?.[k], obj);
}

function isEmpty(value) {
  return value === "" || value === null || value === undefined;
}

function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}