<template>
  <div class="profile-page">
    <h1>My Profile</h1>
    
    <div v-if="loading" class="loading">Loading profile...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="profile-content">
      <div class="profile-section">
        <h2>Personal Information</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="form.firstname" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="form.lastname" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" disabled />
          </div>
          
          <div class="form-group">
            <label>Role</label>
            <input :value="user?.role" type="text" disabled />
          </div>
          
          <div v-if="updateError" class="error-message">{{ updateError }}</div>
          <div v-if="updateSuccess" class="success-message">{{ updateSuccess }}</div>
          
          <button type="submit" class="btn btn-primary" :disabled="updating">
            {{ updating ? 'Updating...' : 'Update Profile' }}
          </button>
        </form>
      </div>
      
      <div class="addresses-section">
        <h2>Saved Addresses</h2>
        
        <div v-if="addresses.length === 0" class="empty-addresses">
          <p>No addresses saved yet</p>
        </div>
        
        <div v-else class="addresses-list">
          <div v-for="address in addresses" :key="address.id" class="address-card">
            <div class="address-info">
              <p>{{ address.street }}</p>
              <p>{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
              <p>{{ address.country }}</p>
            </div>
            <button @click="deleteAddress(address.id)" class="btn-delete">
              Delete
            </button>
          </div>
        </div>
        
        <button @click="showAddressForm = !showAddressForm" class="btn btn-add">
          {{ showAddressForm ? 'Cancel' : '+ Add New Address' }}
        </button>
        
        <div v-if="showAddressForm" class="new-address-form">
          <h3>New Address</h3>
          <div class="form-group">
            <label>Street Address</label>
            <input v-model="newAddress.street" type="text" required />
          </div>
          <div class="form-group">
            <label>City</label>
            <input v-model="newAddress.city" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>State</label>
              <input v-model="newAddress.state" type="text" required />
            </div>
            <div class="form-group">
              <label>ZIP Code</label>
              <input v-model="newAddress.zipCode" type="text" required />
            </div>
          </div>
          <div class="form-group">
            <label>Country</label>
            <input v-model="newAddress.country" type="text" required />
          </div>
          <button @click="saveAddress" class="btn btn-save" :disabled="savingAddress">
            {{ savingAddress ? 'Saving...' : 'Save Address' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import userService from '../services/user.service'

const authStore = useAuthStore()
const user = ref(null)
const form = ref({
  firstname: '',
  lastname: '',
  email: '',
})

const addresses = ref([])
const showAddressForm = ref(false)
const newAddress = ref({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
})

const loading = ref(false)
const error = ref(null)
const updating = ref(false)
const updateError = ref(null)
const updateSuccess = ref(null)
const savingAddress = ref(false)

const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await userService.getCurrentUser()
    user.value = response.data
    form.value = {
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
    }
  } catch (err) {
    error.value = 'Failed to load profile'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadAddresses = async () => {
  try {
    const response = await userService.getAddresses()
    addresses.value = response.data
  } catch (err) {
    console.error('Failed to load addresses', err)
  }
}

const updateProfile = async () => {
  updating.value = true
  updateError.value = null
  updateSuccess.value = null
  
  try {
    await userService.updateProfile({
      firstname: form.value.firstname,
      lastname: form.value.lastname,
    })
    
    // Update auth store
    authStore.user = { ...authStore.user, ...form.value }
    localStorage.setItem('user', JSON.stringify(authStore.user))
    
    updateSuccess.value = 'Profile updated successfully!'
  } catch (err) {
    updateError.value = 'Failed to update profile'
  } finally {
    updating.value = false
  }
}

const saveAddress = async () => {
  savingAddress.value = true
  
  try {
    const response = await userService.createAddress(newAddress.value)
    addresses.value.push(response.data)
    showAddressForm.value = false
    
    // Reset form
    newAddress.value = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }
  } catch (err) {
    alert('Failed to save address')
  } finally {
    savingAddress.value = false
  }
}

const deleteAddress = async (id) => {
  if (!confirm('Are you sure you want to delete this address?')) {
    return
  }
  
  try {
    await userService.deleteAddress(id)
    addresses.value = addresses.value.filter(addr => addr.id !== id)
  } catch (err) {
    alert('Failed to delete address')
  }
}

onMounted(() => {
  loadProfile()
  loadAddresses()
})
</script>

<style scoped>
.profile-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.profile-content {
  display: grid;
  gap: 30px;
}

.profile-section,
.addresses-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

h3 {
  margin: 20px 0 15px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
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

input:disabled {
  background-color: #f5f5f5;
  color: #7f8c8d;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-add {
  background-color: #27ae60;
  color: white;
  width: 100%;
  margin-bottom: 15px;
}

.btn-add:hover {
  background-color: #229954;
}

.btn-save {
  background-color: #27ae60;
  color: white;
  width: 100%;
}

.btn-save:hover:not(:disabled) {
  background-color: #229954;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.success-message {
  background-color: #dfd;
  color: #363;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.empty-addresses {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.addresses-list {
  display: grid;
  gap: 15px;
  margin-bottom: 20px;
}

.address-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.address-info p {
  margin-bottom: 5px;
  color: #2c3e50;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .address-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .btn-delete {
    width: 100%;
  }
}
</style>
