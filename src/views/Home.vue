<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '../api/services';

const router = useRouter();
const featuredProducts = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await productService.getProducts({ 
      active: true,
      size: 8 
    });
    featuredProducts.value = response.data.content || [];
  } catch (error) {
    console.error('Failed to load products:', error);
  } finally {
    loading.value = false;
  }
});

const viewProduct = (id) => {
  router.push(`/products/${id}`);
};
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to E-Shop</h1>
      <p>Discover amazing products at great prices</p>
      <router-link to="/products" class="btn btn-large">Shop Now</router-link>
    </section>

    <section class="featured">
      <h2>Featured Products</h2>
      
      <div v-if="loading" class="loading">Loading products...</div>
      
      <div v-else-if="featuredProducts.length > 0" class="product-grid">
        <div 
          v-for="product in featuredProducts" 
          :key="product.id" 
          class="product-card"
          @click="viewProduct(product.id)"
        >
          <div class="product-image">
            <img :src="product.imageUrl || '/placeholder.jpg'" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="category">{{ product.categoryName }}</p>
            <p class="price">${{ product.unitPrice }}</p>
            <span v-if="product.stock <= 0" class="out-of-stock">Out of Stock</span>
          </div>
        </div>
      </div>
      
      <div v-else class="no-products">
        <p>No products available at the moment.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 100%;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: transform 0.3s;
}

.btn:hover {
  transform: translateY(-2px);
}

.featured {
  margin-bottom: 3rem;
}

.featured h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
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
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
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
}

.out-of-stock {
  display: inline-block;
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
