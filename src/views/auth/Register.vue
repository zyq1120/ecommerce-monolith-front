<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { Lock, User, Message } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  email: '',
  firstname: '',
  lastname: '',
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
  email: [
    { required: true, message: 'Please input email address', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
  ],
  firstname: [
    { required: true, message: 'Please input first name', trigger: 'blur' }
  ],
  lastname: [
    { required: true, message: 'Please input last name', trigger: 'blur' }
  ],
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
        await authStore.register({
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          password: formData.password,
        });
        ElMessage.success('Registration successful! Please check your email for verification code.');
        setTimeout(() => {
          router.push({ name: 'Verify', query: { email: formData.email } });
        }, 2000);
      } catch (err) {
        if (err.response?.status === 409) {
          ElMessage.error('An account with this email already exists.');
        } else {
          ElMessage.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
      <el-col :xs="22" :sm="18" :md="14" :lg="10">
        <el-card shadow="always">
          <template #header>
            <div class="card-header">
              <h1>Register</h1>
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

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="First Name" prop="firstname">
                  <el-input
                    v-model="formData.firstname"
                    :prefix-icon="User"
                    placeholder="First name"
                    size="large"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Last Name" prop="lastname">
                  <el-input
                    v-model="formData.lastname"
                    :prefix-icon="User"
                    placeholder="Last name"
                    size="large"
                  />
                </el-form-item>
              </el-col>
            </el-row>

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

            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                :prefix-icon="Lock"
                placeholder="Confirm your password"
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
                {{ loading ? 'Registering...' : 'Register' }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <div class="auth-links">
            <el-link type="primary" @click="router.push('/login')">
              Already have an account? Login
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
  text-align: center;
}
</style>
