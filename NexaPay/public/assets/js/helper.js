export function edit(target) {
  const id = $(target);
  if (id) {
    switchClass(id,"preview-mode","edit-mode")
  }
}

export function switchClass(el,from,to) {
  if (el) {
    el.classList.remove(from);
    el.classList.add(to);
    
    console.log(`Switch class on element: ${el} from ${from}
    to ${to}`)
  }
}