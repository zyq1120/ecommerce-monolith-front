<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { ShoppingCart, User, UserFilled } from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.isAdmin);
const itemCount = computed(() => cartStore.itemCount);
const userName = computed(() => authStore.user?.firstname || '用户');

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <el-text size="large" tag="b">E-Shop</el-text>
        </router-link>
      </div>
      
      <el-menu
        mode="horizontal"
        :ellipsis="false"
        :background-color="'var(--header-bg)'"
        text-color="#fff"
        :active-text-color="'var(--youdao-blue-lighter)'"
        router
        class="main-menu"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/products">商品</el-menu-item>
        
        <template v-if="isAuthenticated">
          <el-menu-item index="/orders">我的订单</el-menu-item>
          <el-menu-item index="/profile">个人中心</el-menu-item>
          <el-menu-item v-if="isAdmin" index="/admin">管理后台</el-menu-item>
        </template>
      </el-menu>
      
      <div class="actions">
        <el-badge :value="itemCount" :hidden="itemCount === 0" class="cart-badge">
          <el-button @click="router.push('/cart')" circle>
            <el-icon><ShoppingCart /></el-icon>
          </el-button>
        </el-badge>
        
        <template v-if="!isAuthenticated">
          <el-button @click="router.push('/login')">登录</el-button>
          <el-button type="primary" @click="router.push('/register')">注册</el-button>
        </template>
        <template v-else>
          <el-dropdown>
            <el-button circle>
              <el-icon><UserFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>{{ userName }}</el-dropdown-item>
                <el-dropdown-item divided @click="router.push('/profile')">个人中心</el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
  </el-header>
</template>

<style scoped>
.header {
  background: var(--header-bg);
  color: white;
  padding: 0;
  height: 60px;
  box-shadow: 0 2px 8px rgba(12, 124, 213, 0.15);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 20px;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.logo a {
  color: white;
  text-decoration: none;
}

.main-menu {
  flex: 1;
  border: none;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cart-badge {
  margin-right: 0.5rem;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: 2px solid var(--youdao-blue-lighter);
}
</style>
