<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { Message } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const formData = reactive({ email: '' });
const loading = ref(false);
const formRef = ref(null);

const rules = {
  email: [
    { required: true, message: 'Please input email address', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email address', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await authStore.redeemPassword(formData.email);
        ElMessage.success('Password reset link sent to your email. Please check your inbox.');
      } catch (err) {
        ElMessage.error(err.response?.data?.message || 'Failed to send reset link.');
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
              <h1>Forgot Password</h1>
              <el-text type="info">Enter your email to receive a password reset link.</el-text>
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
                :prefix-icon="Message"
                placeholder="Enter your email"
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
                {{ loading ? 'Sending...' : 'Send Reset Link' }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <div class="auth-links">
            <el-link type="primary" @click="router.push('/login')">
              Back to login
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
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.auth-links {
  text-align: center;
}
</style>
