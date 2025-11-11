<template>
  <div class="order-detail-page">
    <div v-if="loading" class="loading">Loading order details...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="order" class="order-detail">
      <div class="order-header">
        <h1>Order Details</h1>
        <router-link to="/orders" class="btn btn-back">Back to Orders</router-link>
      </div>
      
      <div class="order-info">
        <div class="info-section">
          <h2>Order Information</h2>
          <div class="info-item">
            <span class="label">Order Number:</span>
            <span>{{ order.orderTrackingNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">Order Date:</span>
            <span>{{ formatDate(order.createdDate) }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status:</span>
            <span class="order-status" :class="'status-' + order.status.toLowerCase()">
              {{ order.status }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">Total Items:</span>
            <span>{{ order.totalQuantity }}</span>
          </div>
          <div class="info-item total">
            <span class="label">Total Price:</span>
            <span class="price">${{ order.totalPrice }}</span>
          </div>
        </div>
        
        <div class="items-section">
          <h2>Order Items</h2>
          <div v-for="item in order.orderItems" :key="item.id" class="order-item">
            <div class="item-name">{{ item.productName || `Product #${item.productId}` }}</div>
            <div class="item-details">
              <span>Quantity: {{ item.quantity }}</span>
              <span>Unit Price: ${{ item.unitPrice }}</span>
              <span class="item-total">Total: ${{ (item.quantity * item.unitPrice).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import orderService from '../services/order.service'

const route = useRoute()
const order = ref(null)
const loading = ref(false)
const error = ref(null)

const loadOrder = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await orderService.getOrderById(route.params.id)
    order.value = response.data
  } catch (err) {
    error.value = 'Failed to load order details'
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
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  loadOrder()
})
</script>

<style scoped>
.order-detail-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
}

.btn-back {
  background-color: #95a5a6;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

.btn-back:hover {
  background-color: #7f8c8d;
}

.order-detail {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-info {
  display: grid;
  gap: 30px;
}

.info-section,
.items-section {
  padding-bottom: 20px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item.total {
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 2px solid #2c3e50;
}

.label {
  color: #7f8c8d;
  font-weight: 500;
}

.price {
  color: #27ae60;
  font-weight: bold;
}

.order-status {
  padding: 6px 12px;
  border-radius: 15px;
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

.order-item {
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.item-name {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.item-details {
  display: flex;
  gap: 20px;
  font-size: 0.95rem;
  color: #555;
}

.item-total {
  color: #27ae60;
  font-weight: bold;
  margin-left: auto;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .item-details {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
