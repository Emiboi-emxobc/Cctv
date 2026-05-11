import * as core from "./helpers.js";
import { cart } from "./modules/cart.js";
import { forms } from "./modules/forms.js";
import { ui } from "./modules/ui.js";
import { products } from "./modules/products.js";
import { users } from "./modules/users.js";

export const Store = {
  ...core,
  cart,
  forms,
  ui,
  products,
  users
};