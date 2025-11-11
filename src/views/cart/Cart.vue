<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import { Delete, ShoppingCart } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const cartStore = useCartStore();

const items = computed(() => cartStore.items);
const totalPrice = computed(() => cartStore.totalPrice);

const updateQuantity = (productId, quantity) => {
  if (quantity > 0) {
    cartStore.updateQuantity(productId, quantity);
  }
};

const removeItem = async (productId, productName) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to remove "${productName}" from your cart?`,
      'Remove Item',
      {
        confirmButtonText: 'Remove',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );
    cartStore.removeItem(productId);
    ElMessage.success('Item removed from cart');
  } catch {
    // User cancelled
  }
};

const checkout = () => {
  router.push('/checkout');
};
</script>

<template>
  <div class="cart-page">
    <el-page-header title="Shopping Cart">
      <template #content>
        <el-icon><ShoppingCart /></el-icon>
        <span> Cart ({{ items.length }} items)</span>
      </template>
    </el-page-header>
    
    <div v-if="items.length === 0" style="margin-top: 40px">
      <el-empty description="Your cart is empty">
        <el-button type="primary" @click="router.push('/products')">
          Continue Shopping
        </el-button>
      </el-empty>
    </div>
    
    <div v-else style="margin-top: 20px">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="16">
          <el-card>
            <el-space direction="vertical" style="width: 100%" size="large">
              <div v-for="item in items" :key="item.id" class="cart-item">
                <el-row :gutter="20" align="middle">
                  <el-col :xs="6" :sm="4">
                    <el-image 
                      :src="item.imageUrl || '/placeholder.jpg'" 
                      :alt="item.name"
                      fit="cover"
                      style="width: 100%; border-radius: 8px"
                    />
                  </el-col>
                  <el-col :xs="18" :sm="10">
                    <div>
                      <el-text size="large" tag="b">{{ item.name }}</el-text>
                      <br />
                      <el-text type="success" tag="b">${{ item.unitPrice }}</el-text>
                    </div>
                  </el-col>
                  <el-col :xs="12" :sm="6">
                    <el-input-number 
                      :model-value="item.quantity"
                      @change="(val) => updateQuantity(item.id, val)"
                      :min="1"
                      :max="item.stock"
                      size="small"
                    />
                  </el-col>
                  <el-col :xs="8" :sm="3">
                    <el-text size="large" tag="b">
                      ${{ (item.unitPrice * item.quantity).toFixed(2) }}
                    </el-text>
                  </el-col>
                  <el-col :xs="4" :sm="1">
                    <el-button 
                      :icon="Delete" 
                      circle 
                      type="danger"
                      @click="removeItem(item.id, item.name)"
                    />
                  </el-col>
                </el-row>
              </div>
            </el-space>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :lg="8">
          <el-card>
            <template #header>
              <el-text size="large" tag="b">Order Summary</el-text>
            </template>
            <el-space direction="vertical" style="width: 100%" size="large">
              <div>
                <el-row justify="space-between">
                  <el-col :span="12">
                    <el-text>Subtotal:</el-text>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-text tag="b">${{ totalPrice }}</el-text>
                  </el-col>
                </el-row>
                <el-row justify="space-between" style="margin-top: 10px">
                  <el-col :span="12">
                    <el-text>Shipping:</el-text>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-text tag="b">FREE</el-text>
                  </el-col>
                </el-row>
              </div>
              <el-divider style="margin: 0" />
              <el-row justify="space-between">
                <el-col :span="12">
                  <el-text size="large" tag="b">Total:</el-text>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-text size="large" tag="b" type="success">${{ totalPrice }}</el-text>
                </el-col>
              </el-row>
              <el-button type="primary" size="large" @click="checkout" style="width: 100%">
                Proceed to Checkout
              </el-button>
              <el-button @click="router.push('/products')" style="width: 100%">
                Continue Shopping
              </el-button>
            </el-space>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-item {
  padding: 1rem;
  border: 1px solid #EBEEF5;
  border-radius: 8px;
}
</style>
