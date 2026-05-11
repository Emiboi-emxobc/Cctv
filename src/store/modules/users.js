import { get, set } from "../helpers.js";

export const users = {
  current() {
    return get("users.current");
  },

  login(user) {
    set("users.current", user);
  },

  logout() {
    set("users.current", null);
  }
};