<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productService } from '../../api/services';
import { useCartStore } from '../../stores/cart';
import { ShoppingCart, ArrowLeft } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

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
    ElMessage.error('Failed to load product');
  } finally {
    loading.value = false;
  }
});

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addItem(product.value, quantity.value);
    ElMessage.success(`Added ${quantity.value} item(s) to cart!`);
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="product-detail" v-loading="loading">
    <el-page-header @back="goBack">
      <template #icon>
        <el-icon><ArrowLeft /></el-icon>
      </template>
      <template #content>
        <el-text size="large">Product Details</el-text>
      </template>
    </el-page-header>

    <el-card v-if="!loading && product" shadow="never" style="margin-top: 20px">
      <el-row :gutter="40">
        <el-col :xs="24" :md="12">
          <el-image 
            :src="product.imageUrl || '/placeholder.jpg'" 
            :alt="product.name"
            fit="cover"
            style="width: 100%; border-radius: 8px"
          />
        </el-col>
        
        <el-col :xs="24" :md="12">
          <el-space direction="vertical" size="large" style="width: 100%">
            <div>
              <h1>{{ product.name }}</h1>
              <el-space>
                <el-tag>{{ product.categoryName }}</el-tag>
                <el-tag type="info">{{ product.brandName }}</el-tag>
              </el-space>
            </div>
            
            <el-divider />
            
            <div>
              <el-text size="large" tag="b" type="success" style="font-size: 2rem">
                ${{ product.unitPrice }}
              </el-text>
            </div>
            
            <div>
              <el-text tag="p" style="line-height: 1.8">
                {{ product.description || 'No description available.' }}
              </el-text>
            </div>
            
            <el-divider />
            
            <el-row :gutter="20" align="middle">
              <el-col :span="12">
                <el-text>Stock:</el-text>
                <el-tag 
                  :type="product.stock > 0 ? 'success' : 'danger'" 
                  style="margin-left: 10px"
                >
                  {{ product.stock > 0 ? `${product.stock} available` : 'Out of Stock' }}
                </el-tag>
              </el-col>
            </el-row>
            
            <el-row :gutter="20" align="middle">
              <el-col :span="8">
                <el-text>Quantity:</el-text>
                <el-input-number 
                  v-model="quantity" 
                  :min="1" 
                  :max="product.stock"
                  :disabled="product.stock <= 0"
                  style="margin-left: 10px"
                />
              </el-col>
            </el-row>
            
            <el-button 
              type="primary" 
              size="large"
              :icon="ShoppingCart"
              @click="addToCart" 
              :disabled="product.stock <= 0"
              style="width: 100%"
            >
              {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </el-button>
          </el-space>
        </el-col>
      </el-row>
    </el-card>
    
    <el-empty v-else-if="!loading" description="Product not found" />
  </div>
</template>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1rem;
}
</style>
