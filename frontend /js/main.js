import { handleForm } from "./handlers/formHandler.js";
import { setupPasswordToggle } from "./togglePassword.js";
import { setupPageSwitch } from "./pageSwitch.js";
import { renderDashboard } from "./dashboard.js";

document.addEventListener("DOMContentLoaded", () => {
  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "panel.html");

  setupPasswordToggle();
  setupPageSwitch();
  
  
// Simulate auto-login after signup or get from localStorage

});