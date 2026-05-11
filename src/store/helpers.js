import { state } from "./state.js";
import { listeners } from "./listeners.js";

export function clone(value) {
  return structuredClone(value);
}

export function get(path) {
  if (!path) return state;
  
  return path.split(".").reduce(
    (acc, key) => acc?.[key],
    state
  );
}

export function set(path, value) {
  const keys = path.split(".");
  let target = state;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    
    if (!target[key]) target[key] = {};
    
    target = target[key];
  }
  
  target[keys.at(-1)] = value;
  
  notify(path, value);
}

export function update(path, updater) {
  const current = get(path);
  set(path, updater(clone(current)));
}

export function notify(path, value) {
  listeners.forEach(listener => {
    if (
      listener.path === null ||
      path.startsWith(listener.path) ||
      listener.path.startsWith(path)
    ) {
      listener.callback(value, state);
    }
  });
}

export function subscribe(path, callback) {
  if (typeof path === "function") {
    callback = path;
    path = null;
  }
  
  const listener = { path, callback };
  
  listeners.push(listener);
  
  return () => {
    const index = listeners.indexOf(listener);
    
    if (index > -1) listeners.splice(index, 1);
  };
}