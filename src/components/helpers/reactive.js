import { Store } from "../../store/store.js";

export function reactive(path, render) {

  // Allow both:
  // reactive(render)
  // reactive("cart.items", render)
  if (typeof path === "function") {
    render = path;
    path = null;
  }

  let node = render();

  function rerender() {
    const newNode = render();

    if (node && node.parentNode) {
      node.replaceWith(newNode);
      node = newNode;
    }
  }

  Store.subscribe(path, rerender);

  return node;
}