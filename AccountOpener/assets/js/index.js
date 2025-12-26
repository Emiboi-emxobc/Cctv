import { getHelp } from './store.js';
import {_$,$} from 'https://cdn.jsdelivr.net/gh/Emiboi-emxobc/Cctv@main/frontend%20/assets/js/dom.js';
(async () => {
const userId ="YCHXGU" || JSON.parse(localStorage.getItem("studentId"));
if (!userId) return;
console.log("getting help")
const help = await getHelp(userId);
console.log("finished getting help: ", help);
alert(help)
//if (!help) return console.warn("No help found");

renderHelp(help);

})();



export function renderHelp(help) {
  const box = _$("div", { className: "mtd fsb" });
  if (!box) return;

  let html  = "";
  help.forEach((h, i) => {
    html += `
    <div class="
      <div>  
        <label for="Whatsapp">  
          <h4 class="label"contenteditable="true">${h?.label || "Get code via Whatsapp"}</h4>    
          <p class="phone" contenteditable ="true"id="${h?.label}">${h?.tel || ""}</p>  
        </label>  
      </div>   
      <div>  
        <input type="radio" name="platform${i}" id="${i}_Code" value="${h?.method || "Unknown"}" ${i === 0 ? "checked" : ''}/>  
      </div>
    `;
  });

  box.innerHTML = html;

  const parent = $(".box");
  if (parent) render(box, parent);
}



export function render(el, parent=document.body){
if (el instanceof HTMLElement) {
parent.appendChild(el)
}
}

