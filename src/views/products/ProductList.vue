<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { productService, categoryService, brandService } from '../../api/services';
import { useCartStore } from '../../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const products = ref([]);
const categories = ref([]);
const brands = ref([]);
const loading = ref(true);
const filters = ref({
  name: '',
  categoryId: null,
  brandId: null,
  active: true,
});

const page = ref(0);
const size = ref(12);
const totalPages = ref(0);

onMounted(async () => {
  await Promise.all([loadCategories(), loadBrands()]);
  await loadProducts();
});

const loadCategories = async () => {
  try {
    const response = await categoryService.getCategories();
    categories.value = response.data.content || [];
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

const loadBrands = async () => {
  try {
    const response = await brandService.getBrands();
    brands.value = response.data.content || [];
  } catch (error) {
    console.error('Failed to load brands:', error);
  }
};

const loadProducts = async () => {
  loading.value = true;
  try {
    const params = {
      ...filters.value,
      page: page.value,
      size: size.value,
    };
    const response = await productService.getProducts(params);
    products.value = response.data.content || [];
    totalPages.value = response.data.totalPages || 0;
  } catch (error) {
    console.error('Failed to load products:', error);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  page.value = 0;
  loadProducts();
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) {
    page.value++;
    loadProducts();
  }
};

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadProducts();
  }
};

const viewProduct = (id) => {
  router.push(`/products/${id}`);
};

const addToCart = (product) => {
  if (product.stock > 0) {
    cartStore.addItem(product);
    alert('Added to cart!');
  }
};
</script>

<template>
  <div class="products-page">
    <h1>Products</h1>
    
    <div class="filters">
      <input
        v-model="filters.name"
        type="text"
        placeholder="Search products..."
        @input="applyFilters"
      />
      
      <select v-model="filters.categoryId" @change="applyFilters">
        <option :value="null">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      
      <select v-model="filters.brandId" @change="applyFilters">
        <option :value="null">All Brands</option>
        <option v-for="brand in brands" :key="brand.id" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>
    
    <div v-else-if="products.length > 0" class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image" @click="viewProduct(product.id)">
          <img :src="product.imageUrl || '/placeholder.jpg'" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3 @click="viewProduct(product.id)">{{ product.name }}</h3>
          <p class="category">{{ product.categoryName }} • {{ product.brandName }}</p>
          <p class="price">${{ product.unitPrice }}</p>
          <div class="actions">
            <button 
              class="btn btn-primary" 
              @click="addToCart(product)"
              :disabled="product.stock <= 0"
            >
              {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-products">
      <p>No products found.</p>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="page === 0">Previous</button>
      <span>Page {{ page + 1 }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page >= totalPages - 1">Next</button>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  max-width: 100%;
}

h1 {
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filters input {
  flex: 1;
  min-width: 200px;
}

.filters select {
  min-width: 150px;
}

.loading,
.no-products {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
  cursor: pointer;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  cursor: pointer;
}

.product-info h3:hover {
  color: #3498db;
}

.category {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
