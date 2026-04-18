import  start from "./src/index.js";
import {Router} from "./src/router/md-router.js";




window.addEventListener("DOMContentLoaded", () => {
  window.router = Router;
  start()
  Router.start();
  

});