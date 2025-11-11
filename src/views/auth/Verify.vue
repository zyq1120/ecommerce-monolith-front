<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { Message, Key } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  email: route.query.email || '',
  verificationCode: '',
});

const loading = ref(false);
const formRef = ref(null);

const rules = {
  email: [
    { required: true, message: 'Please input email address', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email address', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: 'Please input verification code', trigger: 'blur' },
    { len: 6, message: 'Code must be 6 digits', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      try {
        await authStore.verify(formData.email, parseInt(formData.verificationCode));
        ElMessage.success('Account verified successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        if (err.response?.status === 409) {
          ElMessage.warning('Account is already verified.');
        } else if (err.response?.status === 410) {
          ElMessage.error('Verification code has expired.');
        } else {
          ElMessage.error(err.response?.data?.message || 'Verification failed.');
        }
      } finally {
        loading.value = false;
      }
    }
  });
};

const resendCode = async () => {
  try {
    await authService.resendVerification(formData.email);
    ElMessage.success('Verification code sent to your email!');
  } catch (err) {
    ElMessage.error('Failed to resend code.');
  }
};
</script>

<template>
  <div class="auth-page">
    <el-row justify="center">
      <el-col :xs="22" :sm="16" :md="12" :lg="8">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <h1>Verify Your Account</h1>
              <el-text type="info">Please enter the verification code sent to your email.</el-text>
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

            <el-form-item label="Verification Code" prop="verificationCode">
              <el-input
                v-model="formData.verificationCode"
                :prefix-icon="Key"
                placeholder="Enter 6-digit code"
                maxlength="6"
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
                {{ loading ? 'Verifying...' : 'Verify' }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <div class="auth-links">
            <el-link type="primary" @click="resendCode">
              Resend verification code
            </el-link>
            <el-link type="info" @click="router.push('/login')">
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
}
</style>
