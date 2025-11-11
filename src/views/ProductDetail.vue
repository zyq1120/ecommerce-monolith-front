<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="product" class="product-detail">
      <div class="product-image">
        <img :src="product.imageUrl || '/placeholder.jpg'" :alt="product.name" />
      </div>
      
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="category">{{ product.categoryName }} - {{ product.brandName }}</p>
        <p class="price">${{ product.unitPrice }}</p>
        <p class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
          {{ product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' }}
        </p>
        
        <div class="description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
        </div>
        
        <div class="quantity-selector">
          <label for="quantity">Quantity:</label>
          <input
            id="quantity"
            v-model.number="quantity"
            type="number"
            min="1"
            :max="product.stock"
            :disabled="product.stock === 0"
          />
        </div>
        
        <button
          @click="addToCart"
          class="btn btn-add-cart"
          :disabled="product.stock === 0"
        >
          Add to Cart
        </button>
        
        <router-link to="/products" class="btn btn-back">
          Back to Products
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import productService from '../services/product.service'

const route = useRoute()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(false)
const error = ref(null)
const quantity = ref(1)

const loadProduct = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await productService.getProductById(route.params.id)
    product.value = response.data
  } catch (err) {
    error.value = 'Failed to load product'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
  alert('Product added to cart!')
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.product-info h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.category {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 15px;
}

.stock {
  color: #27ae60;
  font-size: 1.1rem;
  margin-bottom: 30px;
  font-weight: 500;
}

.stock.out-of-stock {
  color: #e74c3c;
}

.description {
  margin-bottom: 30px;
}

.description h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.description p {
  line-height: 1.6;
  color: #555;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.quantity-selector input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.btn {
  display: block;
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  margin-bottom: 10px;
}

.btn-add-cart {
  background-color: #3498db;
  color: white;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-add-cart:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.btn-back {
  background-color: #95a5a6;
  color: white;
}

.btn-back:hover {
  background-color: #7f8c8d;
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
  .product-detail {
    grid-template-columns: 1fr;
  }
}
</style>
