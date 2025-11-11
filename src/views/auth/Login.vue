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
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少需要6个字符', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      try {
        await authStore.login(formData.email, formData.password);
        ElMessage.success('登录成功！');
        const redirect = router.currentRoute.value.query.redirect || '/';
        router.push(redirect);
      } catch (err) {
        if (err.response?.status === 403) {
          ElMessage.error('账号未验证，请检查您的邮箱。');
        } else if (err.response?.status === 401) {
          ElMessage.error('邮箱或密码错误。');
        } else {
          ElMessage.error(err.response?.data?.message || '登录失败，请重试。');
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
      <el-col :xs="22" :sm="18" :md="14" :lg="10" :xl="8">
        <el-card shadow="always" class="login-card">
          <template #header>
            <div class="card-header">
              <h1>用户登录</h1>
              <p class="subtitle">欢迎回来</p>
            </div>
          </template>
          
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleSubmit"
            class="login-form"
          >
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="formData.email"
                :prefix-icon="User"
                placeholder="请输入您的邮箱"
                size="large"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                :prefix-icon="Lock"
                placeholder="请输入您的密码"
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
                {{ loading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <div class="auth-links">
            <el-link type="primary" @click="router.push('/register')">
              还没有账号？立即注册
            </el-link>
            <el-link type="info" @click="router.push('/forgot-password')">
              忘记密码？
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
  min-height: calc(100vh - 180px);
  padding: 2.5rem 0;
  background: #f5f7fa;
}

.login-card {
  border-radius: 12px;
}

.card-header {
  text-align: center;
  padding: 1rem 0;
}

.card-header h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 1rem;
}

.login-form {
  padding: 0.5rem 0;
}

.auth-links {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  text-align: center;
  padding: 0.5rem 0;
}
</style>
