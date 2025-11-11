<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: '',
  firstname: '',
  lastname: '',
  password: '',
  confirmPassword: '',
});

const error = ref('');
const success = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  loading.value = true;

  try {
    await authStore.register({
      email: formData.value.email,
      firstname: formData.value.firstname,
      lastname: formData.value.lastname,
      password: formData.value.password,
    });
    success.value = true;
    setTimeout(() => {
      router.push({ name: 'Verify', query: { email: formData.value.email } });
    }, 2000);
  } catch (err) {
    if (err.response?.status === 409) {
      error.value = 'An account with this email already exists.';
    } else {
      error.value = err.response?.data?.message || 'Registration failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Register</h1>
      
      <form @submit.prevent="handleSubmit">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          Registration successful! Please check your email for verification code. Redirecting...
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="firstname">First Name</label>
          <input
            id="firstname"
            v-model="formData.firstname"
            type="text"
            required
            placeholder="Enter your first name"
          />
        </div>

        <div class="form-group">
          <label for="lastname">Last Name</label>
          <input
            id="lastname"
            v-model="formData.lastname"
            type="text"
            required
            placeholder="Enter your last name"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            placeholder="Enter your password"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading || success">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <div class="auth-links">
        <router-link to="/login">Already have an account? Login</router-link>
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
  padding: 2rem 0;
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
  margin-bottom: 2rem;
  color: #2c3e50;
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
}

.auth-links a {
  color: #3498db;
  text-decoration: none;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
