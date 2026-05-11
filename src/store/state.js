import {clone} from './helpers.js';
export const initialState = {
  cart: {
    items: []
  },
  
  users: {
    current: null,
    list: []
  },
  
  products: {
    list: [],
    selected: null
  },
  
  ui: {
    previewImage: null,
    menuOpen: false,
    loading: false
  },
  
  page: {
    current: "home"
  },
  
  filters: {
    category: null,
    search: null
  },
  
  forms: {}
};

export const state = clone(initialState);