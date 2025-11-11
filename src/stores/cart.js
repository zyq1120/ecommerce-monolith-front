import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.unitPrice * item.quantity)
      }, 0)
    },

    cartItems: (state) => state.items,
  },

  actions: {
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find(item => item.productId === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          unitPrice: product.unitPrice,
          quantity: quantity,
          stock: product.stock,
        })
      }
      
      this.saveCart()
    },

    removeFromCart(productId) {
      this.items = this.items.filter(item => item.productId !== productId)
      this.saveCart()
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.productId === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
          this.saveCart()
        }
      }
    },

    clearCart() {
      this.items = []
      this.saveCart()
    },

    saveCart() {
      localStorage.setItem('cartItems', JSON.stringify(this.items))
    },
  },
})
