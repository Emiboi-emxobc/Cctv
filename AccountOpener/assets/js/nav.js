import { $, $$, on, _$ } from "./dom.js";
import {validateInput} from './input.js';
import {registerForm} from './form.js';
function navigate() {
  const pages = $$(".page");
  const btns = $$("[data-role=nav]");

  btns.forEach((btn) => {
    const selector = btn.dataset.target; // e.g "#home"

    on(btn, "click", () => {
      // Remove active from everything
      pages.forEach((page) => page.classList.remove("active"));
      btns.forEach((b) => b.classList.remove("active"));

      // Add active to target page
      const targetEl = $(selector);  // ← FIXED RIGHT HERE
      if (targetEl) targetEl.classList.add("active");
  
      // Activate button
      btn.classList.add("active");
    });
  });
}


on(window,'load',()=>{
  registerForm();
  navigate();
  validateInput()
  
  alert()
})
  

