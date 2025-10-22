import {submit} from './src/helper.js';
import {auth} from './auth.js';
window.onload = () =>{
  
  const iForm = 
  document.getElementById("i-form");
  if (iForm) {
    iForm.addEventListener("submit",(e) =>{
      e.preventDefault()
    submit(iForm)
  })
  }
  
  
  const htmlView = 
  document.querySelectorAll(".v");
  htmlView.forEach(h => {
  h.addEventListener("click", () => {
    const id = h.dataset.target;
    if (h.dataset.role === "html") {
      window.location.href = id;
    } else {
      viewPage(id);
    }
  });
});
  
  

}