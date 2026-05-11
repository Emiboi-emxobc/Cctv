import { get, set, update } from "../helpers.js";

export const cart = {
  // ======================
  // GETTERS
  // ======================
  
  getItems() {
    return get("cart.items") || [];
  },
  
  isEmpty() {
    return this.getItems().length === 0;
  },
  
  getCount() {
    return this.getItems().reduce(
      (sum, item) => sum + (item.qty || 0),
      0
    );
  },
  
  getTotal() {
    return this.getItems().reduce(
      (sum, item) =>
      sum + ((item.price || 0) * (item.qty || 0)),
      0
    );
  },
  
  getSummary() {
    return {
      items: this.getItems(),
      count: this.getCount(),
      total: this.getTotal(),
      
    };
  },
  
  existing(product) {
    if (!product) return false;
    
    return this.getItems().some(
      item =>
      item.id === product.id &&
      item.variant === product.variant
    );
  },
  
  getItem(id, variant) {
    return this.getItems().find(
      item =>
      item.id === id &&
      item.variant === variant
    );
  },
  
  // ======================
  // MUTATIONS
  // ======================
  
  add(product) {
    if (!product) return;
    
    update("cart.items", (items = []) => {
      const existing = items.find(
        item =>
        item.id === product.id &&
        item.variant === product.variant
      );
      
      if (existing) {
        return items.map(item =>
          item.id === product.id &&
          item.variant === product.variant ?
          { ...item, qty: item.qty + 1 } :
          item
        );
      }
      
      return [...items, { ...product, qty: 1 }];
    });
  },
  
  increase(id, variant) {
    update("cart.items", (items = []) =>
      items.map(item =>
        item.id === id &&
        item.variant === variant ?
        { ...item, qty: item.qty + 1 } :
        item
      )
    );
  },
  
  decrease(id, variant) {
    update("cart.items", (items = []) =>
      items
      .map(item =>
        item.id === id &&
        item.variant === variant ?
        { ...item, qty: item.qty - 1 } :
        item
      )
      .filter(item => item.qty > 0)
    );
  },
  
  updateQty(id, variant, qty) {
    if (qty < 1) {
      return this.remove(id, variant);
    }
    
    update("cart.items", (items = []) =>
      items.map(item =>
        item.id === id &&
        item.variant === variant ?
        { ...item, qty } :
        item
      )
    );
  },
  
  remove(id, variant) {
    update("cart.items", (items = []) =>
      items.filter(
        item =>
        !(
          item.id === id &&
          item.variant === variant
        )
      )
    );
  },
  
  clear() {
    set("cart.items", []);
  }
};