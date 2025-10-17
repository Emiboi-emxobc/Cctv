import { handleForm } from "./handlers/formHandler.js";
import { setupPasswordToggle } from "./togglePassword.js";
import { setupPageSwitch } from "./pageSwitch.js";
import { renderDashboard } from "./dashboard.js";
import { copyText } from './helpers.js';

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');

  // ✅ Redirect logic
  const onPanel = window.location.pathname.includes("panel.html");
 // if (token && !onPanel) {
    // If logged in but on index.html, go straight to panel
 //   window.location.href = 'panel.html';
//  } else if (!token && onPanel) {
    // If not logged in but trying to access panel, redirect to login
  //  window.location.href = 'index.html';
//  }
alert()
  // 🧩 Attach form handlers
  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "panel.html");

  // 🔑 UI helpers
  setupPasswordToggle();
  setupPageSwitch();

  // 📋 Copy buttons
  const copyBtns = document.querySelectorAll(".copy");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      const text = targetEl?.value || targetEl?.textContent || "";
      copyText(text);
    });
  });

  // 🖥️ Render dashboard if on panel
  if (onPanel && token) renderDashboard();
});