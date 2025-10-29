import {submit} from './src/helper.js';
import {auth} from './auth.js';
window.onload = () =>{
  const params = new URLSearchParams(window.location.search);
  const refCode = JSON.parse(localStorage.getItem("referralCode")) || params.get("ref");

  // save referral for signup
  

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
      window.location.href = id+`?ref=${refCode}`;
    } else {
      viewPage(id);
    }
  });
});
  
  

}