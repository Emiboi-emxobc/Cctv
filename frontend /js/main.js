import { modal } from "./modal.js";
import {toggleLoader} from "./loader.js";
import {handleForm} from './form.js';
import {setupPageSwitch} from './helpers.js';
// ======================= Nexa Main.js =======================



// ======================= Password Toggle =======================
function setupPasswordToggle() {
  const toggleEyes = document.querySelectorAll(".eye");

  toggleEyes.forEach((eye) => {
    eye.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".password");
      inputs.forEach((input) => {
        if (input.type === "password") {
          input.type = "text";
          eye.classList.remove("fa-eye-slash");
          eye.classList.add("fa-eye");
        } else {
          input.type = "password";
          eye.classList.remove("fa-eye");
          eye.classList.add("fa-eye-slash");
        }
      });
    });
  });
}



// ======================= INIT =======================
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || null;

  if (token && window.location.pathname.endsWith("index.html")) {
    window.location.href = "panel.html";
  }

  handleForm("n-sign-up", "register", "panel.html");
  handleForm("n-sign-in", "login", "panel.html");
  setupPasswordToggle();
  setupPageSwitch();

  document.querySelectorAll(".copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      const text = targetEl?.value || targetEl?.textContent || "";
      copyText(text);
    });
  });

  if (window.location.pathname.endsWith("panel.html")) {
    renderDashboard(user);
  }

  const refLink = document.getElementById("reflink");
  if (user && refLink) {
    refLink.value = `https://cctv-liart.vercel.app?ref=${user.referralCode}`;
  }

  
//navigate pages 
      const navBtns =
       document.querySelectorAll('[data-role="nav"]');
      navBtns.forEach((btn) => {
        btn.addEventListener("click",() =>{
          const location = 
      btn.dataset.target;
      window.location = location;
  //  load(btn);
  alert(location);
  toggleLoader(true)
        } )
      })
  
});