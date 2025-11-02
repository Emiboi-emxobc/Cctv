// assets/js/router.js
import { showPage } from "./ui.js";

export function initRouter() {
  const navButtons = document.querySelectorAll("[data-role=nav]");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.dataset.target;
      if (target) {
        showPage(target);
      }
    });
  });
}