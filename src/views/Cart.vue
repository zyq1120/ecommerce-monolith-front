<template>
  <div class="cart-page">
    <h1>Shopping Cart</h1>
    
    <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <router-link to="/products" class="btn btn-primary">
        Continue Shopping
      </router-link>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartStore.cartItems" :key="item.productId" class="cart-item">
          <img :src="item.imageUrl || '/placeholder.jpg'" :alt="item.name" />
          
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="price">${{ item.unitPrice }}</p>
          </div>
          
          <div class="item-quantity">
            <button @click="decreaseQuantity(item)" class="btn-quantity">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="btn-quantity">+</button>
          </div>
          
          <div class="item-total">
            <p>${{ (item.unitPrice * item.quantity).toFixed(2) }}</p>
          </div>
          
          <button @click="removeItem(item.productId)" class="btn-remove">
            Remove
          </button>
        </div>
      </div>
      
      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Total Items:</span>
          <span>{{ cartStore.totalItems }}</span>
        </div>
        <div class="summary-row total">
          <span>Total Price:</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        
        <router-link to="/checkout" class="btn btn-checkout">
          Proceed to Checkout
        </router-link>
        
        <router-link to="/products" class="btn btn-continue">
          Continue Shopping
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const increaseQuantity = (item) => {
  if (item.quantity < item.stock) {
    cartStore.updateQuantity(item.productId, item.quantity + 1)
  } else {
    alert('Cannot add more than available stock')
  }
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.productId, item.quantity - 1)
  }
}

const removeItem = (productId) => {
  if (confirm('Are you sure you want to remove this item?')) {
    cartStore.removeFromCart(productId)
  }
}
</script>

<style scoped>
.cart-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
}

.empty-cart p {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #7f8c8d;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.cart-items {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.item-details h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.price {
  font-size: 1.2rem;
  color: #27ae60;
  font-weight: bold;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-quantity {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-quantity:hover {
  background-color: #f5f5f5;
}

.item-total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
}

.btn-remove {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-remove:hover {
  background-color: #c0392b;
}

.cart-summary {
  background: white;
  padding: 30px;
  border-radius: 10px;
  height: fit-content;
}

.cart-summary h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1rem;
}

.summary-row.total {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  padding-top: 15px;
  border-top: 2px solid #eee;
  margin-top: 15px;
}

.btn {
  display: block;
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
}

.btn-primary,
.btn-checkout {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover,
.btn-checkout:hover {
  background-color: #2980b9;
}

.btn-continue {
  background-color: #95a5a6;
  color: white;
}

.btn-continue:hover {
  background-color: #7f8c8d;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 10px;
  }
  
  .item-quantity,
  .item-total,
  .btn-remove {
    grid-column: 2;
  }
}
</style>
