<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { productService, categoryService, brandService } from '../../api/services';
import { useCartStore } from '../../stores/cart';
import { Search, ShoppingCart } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

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

const handlePageChange = (newPage) => {
  page.value = newPage - 1;
  loadProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
  <div class="products-page">
    <el-page-header title="Products" />
    
    <el-card shadow="never" style="margin-top: 20px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="filters.name"
            :prefix-icon="Search"
            placeholder="Search products..."
            @input="applyFilters"
            clearable
            size="large"
          />
        </el-col>
        
        <el-col :xs="24" :sm="6" :md="4">
          <el-select 
            v-model="filters.categoryId" 
            @change="applyFilters"
            placeholder="Category"
            clearable
            size="large"
            style="width: 100%"
          >
            <el-option label="All Categories" :value="null" />
            <el-option 
              v-for="category in categories" 
              :key="category.id" 
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-col>
        
        <el-col :xs="24" :sm="6" :md="4">
          <el-select 
            v-model="filters.brandId" 
            @change="applyFilters"
            placeholder="Brand"
            clearable
            size="large"
            style="width: 100%"
          >
            <el-option label="All Brands" :value="null" />
            <el-option 
              v-for="brand in brands" 
              :key="brand.id" 
              :label="brand.name"
              :value="brand.id"
            />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <div v-loading="loading" style="min-height: 400px; margin-top: 20px">
      <el-row v-if="!loading && products.length > 0" :gutter="20">
        <el-col 
          v-for="product in products" 
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
              <el-text 
                size="large" 
                tag="b" 
                @click="viewProduct(product.id)" 
                class="product-name"
                truncated
              >
                {{ product.name }}
              </el-text>
              <el-space>
                <el-tag size="small">{{ product.categoryName }}</el-tag>
                <el-tag size="small" type="info">{{ product.brandName }}</el-tag>
              </el-space>
              <div class="price-section">
                <el-text size="large" tag="b" type="success">${{ product.unitPrice }}</el-text>
                <el-tag v-if="product.stock <= 0" type="danger" size="small">Out of Stock</el-tag>
                <el-tag v-else type="success" size="small">In Stock</el-tag>
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
      
      <el-empty v-else-if="!loading" description="No products found." />
    </div>

    <el-pagination
      v-if="totalPages > 1"
      v-model:current-page="page"
      :page-size="size"
      :total="totalPages * size"
      layout="prev, pager, next"
      @current-change="handlePageChange"
      style="margin-top: 20px; justify-content: center; display: flex"
    />
  </div>
</template>

<style scoped>
.products-page {
  max-width: 100%;
}

.product-card {
  margin-bottom: 20px;
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
  display: block;
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
</style>
