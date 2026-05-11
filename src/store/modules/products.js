import { get, set } from "../helpers.js";

export const products = {
  all() {
    return get("products.list");
  },

  setAll(items) {
    set("products.list", items);
  },

  select(product) {
    set("products.selected", product);
  }
};