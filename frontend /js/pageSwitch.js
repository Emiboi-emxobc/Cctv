import {loader} from './utils/loader.js';
// js/pageSwitch.js
export function setupPageSwitch() {
  
  const viewButtons = document.querySelectorAll(".view-page");
  const pages = document.querySelectorAll(".page");

  viewButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      loader(true)
      const target = btn.value; // the id of page to show
      pages.forEach(p => p.classList.remove("active"));
      const nextPage = document.getElementById(target);
      if (nextPage) nextPage.classList.add("active");
    });
  });
}