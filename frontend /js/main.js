// js/main.js
import { handleForm } from "./handlers/formHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "dashboard.html");
});