<template>
  <div class="verify-page">
    <div class="verify-container">
      <h1>Verify Your Account</h1>
      <p>Please enter the verification code sent to your email.</p>
      
      <form @submit.prevent="handleVerify">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="code">Verification Code</label>
          <input
            id="code"
            v-model="form.verificationCode"
            type="number"
            required
            placeholder="Enter verification code"
          />
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Verifying...' : 'Verify' }}
        </button>
      </form>
      
      <div class="links">
        <button @click="resendCode" :disabled="resendLoading" class="btn-link">
          {{ resendLoading ? 'Sending...' : 'Resend Verification Code' }}
        </button>
        <router-link to="/login">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  verificationCode: '',
})

const loading = ref(false)
const resendLoading = ref(false)
const error = ref(null)
const success = ref(null)

const handleVerify = async () => {
  loading.value = true
  error.value = null
  success.value = null
  
  try {
    await authStore.verify(form.value)
    success.value = 'Account verified successfully! Redirecting to login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    if (err.response?.status === 400) {
      error.value = 'Invalid verification code'
    } else if (err.response?.status === 409) {
      error.value = 'Account is already verified'
    } else if (err.response?.status === 410) {
      error.value = 'Verification code has expired. Please request a new one.'
    } else {
      error.value = err.response?.data?.message || 'Verification failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (!form.value.email) {
    error.value = 'Please enter your email'
    return
  }
  
  resendLoading.value = true
  error.value = null
  success.value = null
  
  try {
    await authStore.resendVerificationCode(form.value.email)
    success.value = 'Verification code resent! Please check your email.'
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to resend code. Please try again.'
  } finally {
    resendLoading.value = false
  }
}
</script>

<style scoped>
.verify-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.verify-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #2c3e50;
}

p {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px;
}

.btn-link:hover:not(:disabled) {
  color: #2980b9;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.success-message {
  background-color: #dfd;
  color: #363;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.links {
  margin-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.links a {
  color: #3498db;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style>
