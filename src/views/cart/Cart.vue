<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const items = computed(() => cartStore.items);
const totalPrice = computed(() => cartStore.totalPrice);

const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity);
};

const removeItem = (productId) => {
  cartStore.removeItem(productId);
};

const checkout = () => {
  router.push('/checkout');
};
</script>

<template>
  <div class="cart-page">
    <h1>Shopping Cart</h1>
    
    <div v-if="items.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <router-link to="/products" class="btn btn-primary">Continue Shopping</router-link>
    </div>
    
    <div v-else>
      <div class="cart-items">
        <div v-for="item in items" :key="item.id" class="cart-item">
          <img :src="item.imageUrl || '/placeholder.jpg'" :alt="item.name" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="price">${{ item.unitPrice }}</p>
          </div>
          <div class="quantity">
            <input 
              type="number" 
              :value="item.quantity" 
              @input="updateQuantity(item.id, parseInt($event.target.value))"
              min="1"
              :max="item.stock"
            />
          </div>
          <div class="subtotal">
            <p>${{ (item.unitPrice * item.quantity).toFixed(2) }}</p>
          </div>
          <button class="remove" @click="removeItem(item.id)">Remove</button>
        </div>
      </div>
      
      <div class="cart-summary">
        <h2>Total: ${{ totalPrice }}</h2>
        <button class="btn btn-primary" @click="checkout">Proceed to Checkout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem 0;
}

.empty-cart p {
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px 100px;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.cart-item img {
  width: 100%;
  border-radius: 4px;
}

.item-info h3 {
  margin-bottom: 0.5rem;
}

.price {
  color: #27ae60;
  font-weight: bold;
}

.quantity input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.subtotal p {
  font-weight: bold;
  color: #2c3e50;
}

.remove {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove:hover {
  background: #c0392b;
}

.cart-summary {
  text-align: right;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.cart-summary h2 {
  margin-bottom: 1rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}
</style>
