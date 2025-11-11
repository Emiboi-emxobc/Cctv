import {Store} from './store.js';

function fetchSettings(admin) {
   await fetch("https://prosper-cub-1.onrender.com/admin/site", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Store.token}`,
  },
  body: JSON.stringify({
    title: form.title?.value,
    subTitle: form.subTitle?.value,
    description: form.description?.value,
  }),
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
}