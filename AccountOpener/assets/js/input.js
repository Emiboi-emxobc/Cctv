
/*input.js USAGE  


input("Email", "email", "email-id", "input-lg");

    or

input({
  label: "Password",
  type: "password",
  id: "pass",
  className: "dark"
}, [icon1, icon2]);

*/

import { _$, $$ } from "./dom.js";



export default function input({label = "", type = "text", id = "", className = "",icons}) {
  

  // Object mode

    
  // Shorthand mode
  

  

  const inp = _$("input", { id, name, type, className });
  const lbl = _$("label", { htmlFor: id }, [label]);
  const con = _$("div", { className: "input-group" }, [inp, lbl]);

  if (icons?.length) {
    icons.forEach(i => con.appendChild(i));
  }

  return con;
}

export function validateInput() {
  $$("input").forEach(inp => {
    if (inp !== null) {
      const group = inp.closest(".input-group");
      
    const check = () =>{
      if (group) {
        group.classList.toggle("not-empty", inp.value.trim() !== "")
      }
    }


    
        inp.addEventListener("input", check);
    inp.addEventListener("blur", check);
    check();
  

    }
    
  })
  
  }
  
  
  function editText(text, el) {
   if (!el) {
     return console.warn(`editText error , Element not found: `,el) 
   }else if(!text){
     return console.warn("No Text specified")
   } else {
      el.innerHTML = text
   }
  }
  
  
  
  


validateInput()