const initialState = {
  cart: {
    items: []
  },

  ui: {
    previewImage: null
  },

  filters: {
    category: null,
    search: null
  }
};

const state = structuredClone(initialState);

const listeners = [];

function notify(path, value) {
  listeners.forEach(listener => {
    const shouldNotify =
      listener.path === null ||
      listener.path === path;

    if (shouldNotify) {
      listener.callback(value, state);
    }
  });
}

export const Store = {

  get(path) {
    if (!path) return state;

    const keys = path.split(".");
    let value = state;

    for (const key of keys) {
      value = value?.[key];
    }

    return value;
  },

  set(path, value) {
    const keys = path.split(".");
    let target = state;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      if (!target[key]) {
        target[key] = {};
      }

      target = target[key];
    }

    target[keys[keys.length - 1]] = value;

    notify(path, value);
  },

  update(path, updater) {
    const current = this.get(path);
    const next = updater(current);

    this.set(path, next);
  },

  subscribe(path, callback) {

    // Allow Store.subscribe(callback)
    if (typeof path === "function") {
      callback = path;
      path = null;
    }

    const listener = {
      path,
      callback
    };

    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  },

  reset() {
    Object.keys(state).forEach(key => {
      delete state[key];
    });

    Object.assign(state, structuredClone(initialState));

    notify(null, state);
  }
};