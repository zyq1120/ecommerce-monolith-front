<template>
  <div class="orders-page">
    <h1>My Orders</h1>
    
    <div v-if="loading" class="loading">Loading orders...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="orders.length === 0" class="empty">
      <p>You haven't placed any orders yet</p>
      <router-link to="/products" class="btn btn-primary">
        Start Shopping
      </router-link>
    </div>
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div>
            <h3>Order #{{ order.orderTrackingNumber }}</h3>
            <p class="order-date">{{ formatDate(order.createdDate) }}</p>
          </div>
          <div class="order-status" :class="'status-' + order.status.toLowerCase()">
            {{ order.status }}
          </div>
        </div>
        
        <div class="order-details">
          <div class="detail-item">
            <span class="label">Total Items:</span>
            <span>{{ order.totalQuantity }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Total Price:</span>
            <span class="price">${{ order.totalPrice }}</span>
          </div>
        </div>
        
        <router-link :to="`/orders/${order.id}`" class="btn btn-view">
          View Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import orderService from '../services/order.service'

const orders = ref([])
const loading = ref(false)
const error = ref(null)

const loadOrders = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await orderService.getUserOrders()
    orders.value = response.data.content || []
  } catch (err) {
    error.value = 'Failed to load orders'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
}

.empty p {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #7f8c8d;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.order-header h3 {
  color: #2c3e50;
  margin-bottom: 5px;
}

.order-date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.order-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cfe2ff;
  color: #084298;
}

.status-shipped {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-delivered {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.label {
  color: #7f8c8d;
  font-weight: 500;
}

.price {
  color: #27ae60;
  font-weight: bold;
  font-size: 1.2rem;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-view {
  background-color: #3498db;
  color: white;
}

.btn-view:hover {
  background-color: #2980b9;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .order-details {
    grid-template-columns: 1fr;
  }
}
</style>
