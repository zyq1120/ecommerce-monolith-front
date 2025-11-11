<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { Lock, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const formRef = ref(null);

const rules = {
  email: [
    { required: true, message: 'Please input email address', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      try {
        await authStore.login(formData.email, formData.password);
        ElMessage.success('Login successful!');
        const redirect = router.currentRoute.value.query.redirect || '/';
        router.push(redirect);
      } catch (err) {
        if (err.response?.status === 403) {
          ElMessage.error('Account not verified. Please check your email.');
        } else if (err.response?.status === 401) {
          ElMessage.error('Invalid email or password.');
        } else {
          ElMessage.error(err.response?.data?.message || 'Login failed. Please try again.');
        }
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<template>
  <div class="auth-page">
    <el-row justify="center">
      <el-col :xs="22" :sm="16" :md="12" :lg="8">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <h1>Login</h1>
            </div>
          </template>
          
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleSubmit"
          >
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="formData.email"
                :prefix-icon="User"
                placeholder="Enter your email"
                size="large"
              />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                :prefix-icon="Lock"
                placeholder="Enter your password"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                native-type="submit" 
                :loading="loading"
                style="width: 100%"
                size="large"
              >
                {{ loading ? 'Logging in...' : 'Login' }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <div class="auth-links">
            <el-link type="primary" @click="router.push('/register')">
              Don't have an account? Register
            </el-link>
            <el-link type="info" @click="router.push('/forgot-password')">
              Forgot password?
            </el-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

.card-header {
  text-align: center;
}

.card-header h1 {
  margin: 0;
  color: #2c3e50;
}

.auth-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
}
</style>
