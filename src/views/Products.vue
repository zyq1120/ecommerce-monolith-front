<template>
  <div class="products-page">
    <h1>Products</h1>
    
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="search-input"
        @input="handleSearch"
      />
      
      <select v-model="filters.categoryId" @change="loadProducts" class="filter-select">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      
      <select v-model="filters.brandId" @change="loadProducts" class="filter-select">
        <option value="">All Brands</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <router-link :to="`/products/${product.id}`" class="product-link">
            <img :src="product.imageUrl || '/placeholder.jpg'" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p class="price">${{ product.unitPrice }}</p>
            <p class="category">{{ product.categoryName }}</p>
            <p class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
              {{ product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' }}
            </p>
          </router-link>
          <button
            @click="addToCart(product)"
            class="btn btn-add-cart"
            :disabled="product.stock === 0"
          >
            Add to Cart
          </button>
        </div>
      </div>
      
      <div v-if="totalPages > 1" class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 0" class="btn-page">
          Previous
        </button>
        <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" class="btn-page">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import productService from '../services/product.service'
import categoryService from '../services/category.service'
import brandService from '../services/brand.service'

const cartStore = useCartStore()

const products = ref([])
const categories = ref([])
const brands = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const filters = ref({
  categoryId: '',
  brandId: '',
  active: true,
})

const currentPage = ref(0)
const pageSize = ref(12)
const totalPages = ref(0)

const loadProducts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      active: filters.value.active,
    }
    
    if (searchQuery.value) {
      params.name = searchQuery.value
    }
    if (filters.value.categoryId) {
      params.categoryId = filters.value.categoryId
    }
    if (filters.value.brandId) {
      params.brandId = filters.value.brandId
    }
    
    const response = await productService.searchProducts(params)
    products.value = response.data.content || []
    totalPages.value = response.data.totalPages || 0
  } catch (err) {
    error.value = 'Failed to load products'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await categoryService.getCategories()
    categories.value = response.data.content || []
  } catch (err) {
    console.error('Failed to load categories', err)
  }
}

const loadBrands = async () => {
  try {
    const response = await brandService.getBrands()
    brands.value = response.data.content || []
  } catch (err) {
    console.error('Failed to load brands', err)
  }
}

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    loadProducts()
  }, 500)
}

const goToPage = (page) => {
  currentPage.value = page
  loadProducts()
}

const addToCart = (product) => {
  cartStore.addToCart(product)
  alert('Product added to cart!')
}

onMounted(() => {
  loadProducts()
  loadCategories()
  loadBrands()
})
</script>

<style scoped>
.products-page {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.filter-select {
  min-width: 150px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
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
  margin-bottom: 10px;
}

.stock {
  color: #27ae60;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.stock.out-of-stock {
  color: #e74c3c;
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

.btn-add-cart:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-add-cart:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.btn-page {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-page:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-page:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #2c3e50;
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
