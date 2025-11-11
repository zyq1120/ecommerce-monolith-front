<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        E-Commerce
      </router-link>
      
      <div class="navbar-menu">
        <router-link to="/products" class="nav-link">Products</router-link>
        
        <router-link to="/cart" class="nav-link cart-link">
          Cart
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </router-link>
        
        <template v-if="authStore.isAuthenticated">
          <router-link to="/orders" class="nav-link">Orders</router-link>
          <router-link to="/profile" class="nav-link">Profile</router-link>
          <router-link v-if="authStore.isAdmin" to="/admin" class="nav-link">Admin</router-link>
          <button @click="logout" class="nav-link btn-logout">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link btn-register">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-brand:hover {
  color: #3498db;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.btn-register {
  background-color: #3498db;
}

.btn-register:hover {
  background-color: #2980b9;
}

.btn-logout {
  background-color: #e74c3c;
}

.btn-logout:hover {
  background-color: #c0392b;
}
</style>
