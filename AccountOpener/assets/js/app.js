import { title } from "./components/text/title.js";
import { mainBtn } from "./components/buttons/mainBtn.js";
import { inputGroup } from "./components/inputs/inputGroup.js";
import { card } from "./components/layout/card.js";

const app = document.querySelector("#app");

const signupForm = card("p8", [
   title("h2", "page-title", "Sign Up"),
   inputGroup({type:"text", id:"first-name", name:"firstname"}, "First name"),
   inputGroup({type:"text", id:"last-name", name:"lastname"}, "Last name"),
   mainBtn("Continue", "fas fa-arrow-right")
]);

app.appendChild(signupForm);