<template>
  <div class="checkout-page">
    <h1>Checkout</h1>
    
    <div class="checkout-content">
      <div class="checkout-form">
        <h2>Shipping Address</h2>
        
        <div v-if="loadingAddresses" class="loading">Loading addresses...</div>
        <div v-else>
          <div v-if="addresses.length > 0" class="address-selection">
            <select v-model="selectedAddressId" class="address-select">
              <option value="">Select an address</option>
              <option v-for="address in addresses" :key="address.id" :value="address.id">
                {{ address.street }}, {{ address.city }}, {{ address.state }} {{ address.zipCode }}
              </option>
            </select>
            <button @click="showNewAddressForm = true" class="btn-new-address">
              + New Address
            </button>
          </div>
          
          <div v-if="showNewAddressForm || addresses.length === 0" class="new-address-form">
            <h3>{{ addresses.length === 0 ? 'Add Shipping Address' : 'New Address' }}</h3>
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
            <button v-if="addresses.length > 0" @click="showNewAddressForm = false" class="btn btn-cancel">
              Cancel
            </button>
          </div>
        </div>
        
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <button @click="placeOrder" class="btn btn-place-order" :disabled="loading || !canPlaceOrder">
          {{ loading ? 'Placing Order...' : 'Place Order' }}
        </button>
      </div>
      
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div v-for="item in cartStore.cartItems" :key="item.productId" class="summary-item">
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>${{ (item.unitPrice * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="summary-total">
          <span>Total</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import userService from '../services/user.service'
import orderService from '../services/order.service'

const router = useRouter()
const cartStore = useCartStore()

const addresses = ref([])
const selectedAddressId = ref('')
const showNewAddressForm = ref(false)
const loadingAddresses = ref(false)
const savingAddress = ref(false)
const loading = ref(false)
const error = ref(null)

const newAddress = ref({
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
})

const canPlaceOrder = computed(() => {
  return selectedAddressId.value && cartStore.cartItems.length > 0
})

const loadAddresses = async () => {
  loadingAddresses.value = true
  try {
    const response = await userService.getAddresses()
    addresses.value = response.data
    if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }
  } catch (err) {
    console.error('Failed to load addresses', err)
  } finally {
    loadingAddresses.value = false
  }
}

const saveAddress = async () => {
  savingAddress.value = true
  error.value = null
  
  try {
    const response = await userService.createAddress(newAddress.value)
    addresses.value.push(response.data)
    selectedAddressId.value = response.data.id
    showNewAddressForm.value = false
    
    // Reset form
    newAddress.value = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    }
  } catch (err) {
    error.value = 'Failed to save address'
  } finally {
    savingAddress.value = false
  }
}

const placeOrder = async () => {
  loading.value = true
  error.value = null
  
  try {
    const orderData = {
      addressId: selectedAddressId.value,
      orderItems: cartStore.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    }
    
    const response = await orderService.createOrder(orderData)
    cartStore.clearCart()
    
    alert('Order placed successfully!')
    router.push(`/orders/${response.data.id}`)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to place order'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (cartStore.cartItems.length === 0) {
    router.push('/cart')
  }
  loadAddresses()
})
</script>

<style scoped>
.checkout-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.checkout-form,
.order-summary {
  background: white;
  padding: 30px;
  border-radius: 10px;
}

h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.address-selection {
  margin-bottom: 20px;
}

.address-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 1rem;
}

.btn-new-address {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-new-address:hover {
  background-color: #2980b9;
}

.new-address-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
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

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
}

.btn-save {
  background-color: #27ae60;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background-color: #229954;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}

.btn-place-order {
  background-color: #e67e22;
  color: white;
  font-size: 1.1rem;
  padding: 15px;
}

.btn-place-order:hover:not(:disabled) {
  background-color: #d35400;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.order-summary {
  height: fit-content;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #2c3e50;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
