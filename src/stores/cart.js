import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),
  
  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          ...product,
          quantity,
        });
      }
      
      this.saveCart();
    },
    
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveCart();
    },
    
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeItem(productId);
        } else {
          this.saveCart();
        }
      }
    },
    
    clearCart() {
      this.items = [];
      this.saveCart();
    },
    
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
  },
  
  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (parseFloat(item.unitPrice) * item.quantity);
      }, 0).toFixed(2);
    },
  },
});
