<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>
    <nav class="admin-nav">
      <router-link to="/admin/products">Products</router-link>
      <router-link to="/admin/categories">Categories</router-link>
      <router-link to="/admin/brands">Brands</router-link>
      <router-link to="/admin/orders">Orders</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-nav {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.admin-nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #2c3e50;
  border-radius: 4px;
}

.admin-nav a:hover,
.admin-nav a.router-link-active {
  background: #3498db;
  color: white;
}
</style>
