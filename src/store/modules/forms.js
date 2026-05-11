import { get, set } from "../helpers.js";

export const forms = {
  get(name) {
    return get(`forms.${name}`) || {};
  },
  
  setField(form, field, value) {
    set(`forms.${form}.data.${field}`, value);
  },
  
  getField(form, field) {
    return get(`forms.${form}.data.${field}`);
  },
  
  setErrors(form, errors) {
    set(`forms.${form}.errors`, errors);
  },
  
  reset(form) {
    set(`forms.${form}`, {
      data: {},
      errors: {},
      submitting: false
    });
  }
};