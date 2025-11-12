import {Store} from './store.js';
import {modal} from './modal.js';


export 
async function fetchSettings(form) {
   const res = await fetch("https://prosper-cub-1.onrender.com/admin/site", {
  method: "POST",
  headers: {
    "Content-Type":"application/json",
    Authorization: `Bearer ${Store.token}`,
  },
  body: JSON.stringify(form),
});


  const data = await res.json();
  if (data.success) {
    Store.settings=data.site;
    console.log(Store.settings)
    
    alert("settings saved to database but not updated")
  }


}