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
    ElMessage.success('已加入购物车！');
  }
};
</script>

<template>
  <div class="home">
    <div class="hero-container">
      <el-row justify="center">
        <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
          <div class="hero">
            <h1>欢迎来到 E-Shop</h1>
            <p>发现优质产品，享受超值价格</p>
            <el-button type="primary" size="large" @click="router.push('/products')">
              立即购物
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="featured-container">
      <el-row justify="center">
        <el-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16">
          <div class="featured">
            <h2>精选商品</h2>
            
            <div v-if="loading" v-loading="loading" style="min-height: 300px"></div>
            
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
                      style="width: 100%; height: 220px"
                    />
                  </div>
                  <div class="product-info">
                    <el-text size="large" tag="b" @click="viewProduct(product.id)" class="product-name">
                      {{ product.name }}
                    </el-text>
                    <el-text size="small" type="info">{{ product.categoryName }}</el-text>
                    <div class="price-section">
                      <el-text size="large" tag="b" type="success">¥{{ product.unitPrice }}</el-text>
                      <el-tag v-if="product.stock <= 0" type="danger" size="small">缺货</el-tag>
                    </div>
                    <el-button 
                      type="primary" 
                      :icon="ShoppingCart"
                      @click="addToCart(product)"
                      :disabled="product.stock <= 0"
                      style="width: 100%"
                    >
                      加入购物车
                    </el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            
            <el-empty v-else description="暂无商品" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 100%;
  background: #f5f7fa;
}

.hero-container {
  background: linear-gradient(135deg, var(--hero-gradient-start) 0%, var(--hero-gradient-end) 100%);
  padding: 2rem 0;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
  border-radius: 12px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.hero p {
  font-size: 1.35rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
}

.featured-container {
  padding: 3rem 0;
}

.featured {
  padding: 0 1rem;
}

.featured h2 {
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2.2rem;
  color: #2c3e50;
  font-weight: 600;
}

.product-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-8px);
}

.product-image {
  cursor: pointer;
  overflow: hidden;
  background: #f8f9fa;
}

.product-info {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  background: white;
}

.product-name {
  cursor: pointer;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    font-size: 2.2rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
  
  .featured h2 {
    font-size: 1.8rem;
  }
}
</style>
