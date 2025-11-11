<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    
    <div class="admin-menu">
      <div class="menu-card">
        <h3>Product Management</h3>
        <p>Manage products, categories, and brands</p>
        <p class="coming-soon">Coming Soon</p>
      </div>
      
      <div class="menu-card">
        <h3>Order Management</h3>
        <p>View and manage customer orders</p>
        <p class="coming-soon">Coming Soon</p>
      </div>
      
      <div class="menu-card">
        <h3>User Management</h3>
        <p>View and manage users</p>
        <p class="coming-soon">Coming Soon</p>
      </div>
      
      <div class="menu-card">
        <h3>Analytics</h3>
        <p>View sales and performance metrics</p>
        <p class="coming-soon">Coming Soon</p>
      </div>
    </div>
    
    <div class="info-message">
      <p>Admin features are under development. This is a placeholder for the admin dashboard.</p>
      <p>Future features will include:</p>
      <ul>
        <li>Product management (CRUD operations)</li>
        <li>Category and brand management</li>
        <li>Order status updates</li>
        <li>User management</li>
        <li>Sales analytics and reports</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// Redirect if not admin
if (!authStore.isAdmin) {
  window.location.href = '/'
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.admin-menu {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.menu-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.menu-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.menu-card p {
  color: #7f8c8d;
  margin-bottom: 15px;
}

.coming-soon {
  background-color: #fff3cd;
  color: #856404;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  display: inline-block;
  margin-top: 15px;
}

.info-message {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-message p {
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.6;
}

.info-message ul {
  margin-left: 30px;
  color: #555;
}

.info-message li {
  margin-bottom: 10px;
}
</style>
