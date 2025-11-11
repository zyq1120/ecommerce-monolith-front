<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productService } from '../../api/services';
import { useCartStore } from '../../stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref(null);
const loading = ref(true);
const quantity = ref(1);

onMounted(async () => {
  try {
    const response = await productService.getProductById(route.params.id);
    product.value = response.data;
  } catch (error) {
    console.error('Failed to load product:', error);
  } finally {
    loading.value = false;
  }
});

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addItem(product.value, quantity.value);
    alert('Added to cart!');
  }
};
</script>

<template>
  <div class="product-detail">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="product" class="content">
      <div class="image">
        <img :src="product.imageUrl || '/placeholder.jpg'" :alt="product.name" />
      </div>
      <div class="info">
        <h1>{{ product.name }}</h1>
        <p class="category">{{ product.categoryName }} • {{ product.brandName }}</p>
        <p class="price">${{ product.unitPrice }}</p>
        <p class="description">{{ product.description }}</p>
        <p class="stock">Stock: {{ product.stock }}</p>
        <div class="actions">
          <input v-model.number="quantity" type="number" min="1" :max="product.stock" />
          <button class="btn btn-primary" @click="addToCart" :disabled="product.stock <= 0">
            {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else>Product not found</div>
  </div>
</template>

<style scoped>
.product-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.image {
  width: 100%;
}

.image img {
  width: 100%;
  border-radius: 8px;
}

.info h1 {
  margin-bottom: 1rem;
}

.category {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 1rem;
}

.description {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.stock {
  margin-bottom: 1rem;
  color: #666;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.actions input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
