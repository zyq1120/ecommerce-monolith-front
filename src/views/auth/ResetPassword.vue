<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  token: route.query.token || '',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const formRef = ref(null);

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error('Passwords do not match'));
  } else {
    callback();
  }
};

const rules = {
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await authStore.resetPassword(formData.token, formData.password);
        ElMessage.success('Password reset successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        ElMessage.error(err.response?.data?.message || 'Failed to reset password.');
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
              <h1>Reset Password</h1>
            </div>
          </template>
          
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleSubmit"
          >
            <el-form-item label="New Password" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                :prefix-icon="Lock"
                placeholder="Enter new password"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                :prefix-icon="Lock"
                placeholder="Confirm new password"
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
                {{ loading ? 'Resetting...' : 'Reset Password' }}
              </el-button>
            </el-form-item>
          </el-form>
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
</style>
