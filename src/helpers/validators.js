export const validators = {
  required(value) {
    return value !== undefined &&
      value !== null &&
      value !== ""
      ? true
      : "This field is required";
  },

  minLength(length) {
    return value =>
      value?.length >= length
        ? true
        : `Minimum ${length} characters`;
  },

  email(value) {
    return /\S+@\S+\.\S+/.test(value)
      ? true
      : "Invalid email";
  },

  number(value) {
    return !isNaN(value)
      ? true
      : "Must be a number";
  }
};