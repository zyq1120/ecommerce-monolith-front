<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to E-Commerce Store</h1>
      <p>Discover amazing products at great prices</p>
      <router-link to="/products" class="btn btn-primary">
        Browse Products
      </router-link>
    </section>

    <section class="featured">
      <h2>Featured Products</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <router-link :to="`/products/${product.id}`" class="product-link">
            <img :src="product.imageUrl || '/placeholder.jpg'" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p class="price">${{ product.unitPrice }}</p>
            <p class="category">{{ product.categoryName }}</p>
          </router-link>
          <button @click="addToCart(product)" class="btn btn-add-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import productService from '../services/product.service'

const cartStore = useCartStore()
const products = ref([])
const loading = ref(false)
const error = ref(null)

const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await productService.getProducts({ size: 8, active: true })
    products.value = response.data.content || []
  } catch (err) {
    error.value = 'Failed to load products'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const addToCart = (product) => {
  cartStore.addToCart(product)
  alert('Product added to cart!')
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.featured {
  margin-top: 40px;
}

.featured h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.product-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-link {
  text-decoration: none;
  color: inherit;
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
}

.product-card h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 5px;
}

.category {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.btn-add-cart {
  width: 100%;
  background-color: #3498db;
  color: white;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-add-cart:hover {
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
</style>
