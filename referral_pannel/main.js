import {submit} from './src/helper.js';
import {auth} from './auth.js';
window.onload = () =>{
  const metaForm = 
  document.querySelectorAll('.meta-form');
  
  const output = document.getElementById('output');
  
  metaForm.forEach((form) =>{
    if (form) {
      
      form.addEventListener("submit",(e) =>{
        e.preventDefault();
        submit(form)
      })
    }
  })
  
  
  
  
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