<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService } from '../api/services';
import { ShoppingCart } from '@element-plus/icons-vue';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const cartStore = useCartStore();
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

const addToCart = (product) => {
  if (product.stock > 0) {
    cartStore.addItem(product);
    ElMessage.success('Added to cart!');
  }
};
</script>

<template>
  <div class="home">
    <el-row justify="center">
      <el-col :xs="24" :sm="22" :md="20" :lg="18">
        <div class="hero">
          <h1>Welcome to E-Shop</h1>
          <p>Discover amazing products at great prices</p>
          <el-button type="primary" size="large" @click="router.push('/products')">
            Shop Now
          </el-button>
        </div>
      </el-col>
    </el-row>

    <div class="featured">
      <h2>Featured Products</h2>
      
      <div v-if="loading" v-loading="loading" style="min-height: 200px"></div>
      
      <el-row v-else-if="featuredProducts.length > 0" :gutter="20">
        <el-col 
          v-for="product in featuredProducts" 
          :key="product.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card 
            :body-style="{ padding: '0px' }"
            shadow="hover"
            class="product-card"
          >
            <div class="product-image" @click="viewProduct(product.id)">
              <el-image 
                :src="product.imageUrl || '/placeholder.jpg'" 
                :alt="product.name"
                fit="cover"
                style="width: 100%; height: 200px"
              />
            </div>
            <div class="product-info">
              <el-text size="large" tag="b" @click="viewProduct(product.id)" class="product-name">
                {{ product.name }}
              </el-text>
              <el-text size="small" type="info">{{ product.categoryName }}</el-text>
              <div class="price-section">
                <el-text size="large" tag="b" type="success">${{ product.unitPrice }}</el-text>
                <el-tag v-if="product.stock <= 0" type="danger" size="small">Out of Stock</el-tag>
              </div>
              <el-button 
                type="primary" 
                :icon="ShoppingCart"
                @click="addToCart(product)"
                :disabled="product.stock <= 0"
                style="width: 100%"
              >
                Add to Cart
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-empty v-else description="No products available at the moment." />
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 100%;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--hero-gradient-start) 0%, var(--hero-gradient-end) 100%);
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

.featured {
  margin-bottom: 3rem;
}

.featured h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  cursor: pointer;
  overflow: hidden;
}

.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-name {
  cursor: pointer;
}

.product-name:hover {
  color: var(--youdao-blue);
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
}
</style>
