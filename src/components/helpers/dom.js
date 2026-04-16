// =======================
// DOM UTILITIES (STABLE CORE)
// =======================

// -----------------------
// INTERNAL STATE (PRIVATE)
// -----------------------
const _DOM = {
  root: null,
  app: null
};

// -----------------------
// QUERY SINGLE
// -----------------------
export const $ = (selector) => {
  if (typeof selector !== "string") {
    console.warn("DOM.$: selector must be a string", selector);
    return null;
  }

  return document.querySelector(selector);
};

// -----------------------
// QUERY MULTIPLE
// -----------------------
export const $$ = (selector) => {
  if (typeof selector !== "string") {
    console.warn("DOM.$$: selector must be a string", selector);
    return [];
  }

  return document.querySelectorAll(selector);
};
 

export const _$ = (tag, props = {}, ...children) => {

  if (typeof tag !== "string") {
    console.warn("DOM._$: tag must be string", tag);
    return null;
  }

  const el = document.createElement(tag);

  // -----------------------
  // APPLY PROPERTIES
  // -----------------------
  for (const key in props) {

    const value = props[key];

    if (value == null) continue;

    // ROUTE SUPPORT
    if (key === "route") {

  el.setAttribute("href", value);

  el.addEventListener("click", (e) => {
    e.preventDefault();

    if (window.Router) {
      window.Router.navigate(value);
    }
  });

}
else if (key === "key") {

  el.dataset.key = value;

}
    // EVENTS
    else if (key.startsWith("on") && typeof value === "function") {

      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);

    }

    // STYLE OBJECT
    else if (key === "style" && typeof value === "object") {

      Object.assign(el.style, value);

    }

    // DATASET
    else if (key === "dataset" && typeof value === "object") {

      for (const dataKey in value) {
        el.dataset[dataKey] = value[dataKey];
      }

    }

    // HTML
    else if (key === "html") {

      el.innerHTML = value;

    }

    // TEXT
    else if (key === "text") {

      el.textContent = value;

    }

    // CLASS
    else if (key === "class" || key === "className") {

      el.className = value;

    }

    // ATTRIBUTES
    else if (key === "attr" && typeof value === "object") {

      for (const attr in value) {
        el.setAttribute(attr, value[attr]);
      }

    }

    // DEFAULT
    else {

      el[key] = value;

    }

  }

  // -----------------------
  // CHILDREN HANDLER
  // -----------------------

  const append = (child) => {

    if (child == null) return;

    if (Array.isArray(child)) {

      child.forEach(append);
      return;

    }

    if (typeof child === "string" || typeof child === "number") {

      el.appendChild(document.createTextNode(child));
      return;

    }

    if (child instanceof Node) {

      el.appendChild(child);
      return;

    }

    console.warn("DOM._$: invalid child", child);

  };

  children.forEach(append);

  return el;

};


// -----------------------
// SAFE EVENT BINDING
// -----------------------
export const on = (el, event, callback) => {
  if (!el || !(el instanceof EventTarget)) {
    console.warn("DOM.on: invalid target", el);
    return;
  }

  if (typeof event !== "string" || typeof callback !== "function") {
    console.warn("DOM.on: invalid event or callback", event, callback);
    return;
  }

  el.addEventListener(event, callback);
};
// -----------------------
// ROOT RESOLUTION
// -----------------------
const resolveRoot = (scope) => {
  if (scope instanceof HTMLElement) return scope;
  if (typeof scope === "string") return document.querySelector(scope);
  return null;
};

// -----------------------
// PAGE SWAP (DETERMINISTIC)
// -----------------------
export const swapPage = (page, scope = "#root") => {
  if (!(page instanceof Node)) {
    console.warn("DOM.swapPage: page must be a DOM Node", page);
    return;
  }

  const target = resolveRoot(scope);

  if (!target) {
    console.warn("DOM.swapPage: target not found", scope);
    return;
  }

  // Batch DOM update
  const frag = document.createDocumentFragment();
  frag.appendChild(page);

  target.replaceChildren(frag);

  _DOM.root = target;
  _DOM.app = page;
};

// -----------------------
// ADD PAGE (NON-DESTRUCTIVE)
// -----------------------
export const addPage = (page, scope = "#root") => {
  if (!(page instanceof Node)) {
    console.warn("DOM.addPage: page must be a DOM Node", page);
    return;
  }

  const target = resolveRoot(scope);

  if (!target) {
    console.warn("DOM.addPage: target not found", scope);
    return;
  }

  target.appendChild(page);
};

// -----------------------
// PUBLIC API (STABLE OBJECT)
// -----------------------
export const Dom = {
  $,
  $$,
  _$,
  on,
  swapPage,
  addPage,

  // Live getters (no stale snapshots)
  get root() {
    return _DOM.root;
  },
  set root(el) {
    _DOM.root = el;
  },

  get app() {
    return _DOM.app;
  }
};