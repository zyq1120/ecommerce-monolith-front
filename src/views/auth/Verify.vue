<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref(route.query.email || '');
const verificationCode = ref('');
const error = ref('');
const success = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authStore.verify(email.value, parseInt(verificationCode.value));
    success.value = true;
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    if (err.response?.status === 409) {
      error.value = 'Account is already verified.';
    } else if (err.response?.status === 410) {
      error.value = 'Verification code has expired.';
    } else {
      error.value = err.response?.data?.message || 'Verification failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

const resendCode = async () => {
  error.value = '';
  loading.value = true;

  try {
    await authStore.verify(email.value, 0); // Resend endpoint
    error.value = '';
    alert('Verification code sent to your email!');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to resend code.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Verify Your Account</h1>
      <p class="info">Please enter the verification code sent to your email.</p>
      
      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          Account verified successfully! Redirecting to login...
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="code">Verification Code</label>
          <input
            id="code"
            v-model="verificationCode"
            type="text"
            required
            placeholder="Enter 6-digit code"
            maxlength="6"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading || success">
          {{ loading ? 'Verifying...' : 'Verify' }}
        </button>
      </form>

      <div class="auth-links">
        <a href="#" @click.prevent="resendCode">Resend verification code</a>
        <router-link to="/login">Back to login</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.info {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-links a {
  color: #3498db;
  text-decoration: none;
  cursor: pointer;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
