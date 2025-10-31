import { Router } from "./script/shared/router.js";

const routes = {
  home: renderHome,
  about: renderAbout,
};



window.onload = function() {
  const router = new Router(routes, "app"); // 'app' is your main div
router.start("home");

document.querySelectorAll("[data-route]").forEach(btn => {
  btn.addEventListener("click", () => {
    router.navigate(btn.dataset.route);
  });
});
}