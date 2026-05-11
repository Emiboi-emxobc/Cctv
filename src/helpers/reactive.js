import { Store } from "../store/index.js";

export function reactive(path, render) {
  if (typeof path === "function") {
    render = path;
    path = null;
  }

  let node = null;

  function getState() {
    return path ? Store.get(path) : Store.get();
  }

  function normalize(newNode) {
    if (
      newNode === null ||
      newNode === undefined ||
      newNode === false
    ) {
      return document.createComment("empty");
    }

    return newNode;
  }

  function commit(newNode) {
    const safeNode = normalize(newNode);

    if (!node) {
      node = safeNode;
      return node;
    }

    if (node.parentNode) {
      node.replaceWith(safeNode);
    }

    node = safeNode;
  }

  function rerender() {
    commit(render(getState()));
  }

  node = normalize(render(getState()));

  Store.subscribe(path, rerender);

  return node;
}