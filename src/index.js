import { registerRoutes } from "./router/registerRoutes.js";
import {Router} from "./router/md-router.js"


export default function start() {
  registerRoutes();
  Router.start();

  console.log("App booted 🚀");
}