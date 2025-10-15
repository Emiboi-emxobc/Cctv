import { handleForm } from "./handlers/formHandler.js";
import { setupPasswordToggle } from "./togglePassword.js";
import { setupPageSwitch } from "./pageSwitch.js";
import { renderDashboard } from "./dashboard.js";
import {copyText} from './helpers.js';
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem('token'); 
  if (!isLoggedIn) {
    window.location.href = 'index.html';
  } else {
    window.location.href = 'panel.html';
  }
  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "panel.html");

  setupPasswordToggle();
  setupPageSwitch();

  const copyBtns = document.querySelectorAll(".copy");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);

      if (!targetEl) {
        copyText(""); // fallback
        return;
      }

      // Get text from input, textarea, or element
      const text = targetEl.value || targetEl.textContent || "";
      copyText(text);
  
  });
});
});