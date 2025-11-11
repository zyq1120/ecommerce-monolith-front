<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const itemCount = computed(() => cartStore.itemCount);

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="logo">
        <router-link to="/">E-Shop</router-link>
      </div>
      
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/products">Products</router-link>
        
        <template v-if="isAuthenticated">
          <router-link to="/orders">My Orders</router-link>
          <router-link to="/profile">Profile</router-link>
          <router-link v-if="isAdmin" to="/admin">Admin</router-link>
        </template>
      </nav>
      
      <div class="actions">
        <router-link to="/cart" class="cart-link">
          🛒 Cart
          <span v-if="itemCount > 0" class="badge">{{ itemCount }}</span>
        </router-link>
        
        <template v-if="!isAuthenticated">
          <router-link to="/login" class="btn">Login</router-link>
          <router-link to="/register" class="btn btn-primary">Register</router-link>
        </template>
        <template v-else>
          <button @click="logout" class="btn">Logout</button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.logo a {
  color: white;
  text-decoration: none;
}

.nav {
  flex: 1;
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav a:hover,
.nav a.router-link-active {
  background: rgba(255, 255, 255, 0.1);
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cart-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  position: relative;
  transition: background 0.3s;
}

.cart-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  border: 1px solid white;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:hover {
  background: white;
  color: #2c3e50;
}

.btn-primary {
  background: #3498db;
  border-color: #3498db;
}

.btn-primary:hover {
  background: #2980b9;
  border-color: #2980b9;
  color: white;
}
</style>
