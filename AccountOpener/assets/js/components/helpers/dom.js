// =======================
// DOM UTILITIES
// =======================

// Query single element
export const $ = (selector) => {
  if (typeof selector !== "string") {
    console.warn(`Invalid selector:`, selector);
    return null;
  }

  const el = document.querySelector(selector);
  if (!el) console.warn(`Element not found: ${selector}`);
  return el;
};

// Query multiple elements
export const $$ = (selector) => {
  if (typeof selector !== "string") {
    console.warn(`Invalid selector:`, selector);
    return [];
  }

  const els = document.querySelectorAll(selector);
  if (!els.length) console.warn(`No elements found: ${selector}`);
  return els;
};

// Create element with props + children
export const _$ = (tag, props = {}, ...children) => {
  if (typeof tag !== "string") {
    console.warn(`Invalid HTML tag:`, tag);
    return null;
  }

  const el = document.createElement(tag);

  // Assign properties
  for (const key in props) {
    const value = props[key];

    // Event listeners: onClick => click
    if (key.startsWith("on") && typeof value === "function") {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, value);

    // Inline style object
    } else if (key === "style" && typeof value === "object") {
      Object.assign(el.style, value);

    // innerHTML override
    } else if (key === "html") {
      el.innerHTML = value;

    // Normal props (className, id, value, etc)
    } else {
      el[key] = value;
    }
  }

  // Children
  for (const child of children) {
    if (typeof child === "string") {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }

  return el;
};

// Safe event binding
export const on = (el, event, callback) => {
  if (!(el instanceof HTMLElement)) {
    console.warn(`Target is not a valid element:`, el);
    return;
  }
  if (typeof event !== "string") {
    console.warn(`Event type must be a string:`, event);
    return;
  }
  if (typeof callback !== "function") {
    console.warn(`Callback must be a function:`, callback);
    return;
  }

  el.addEventListener(event, callback);
};