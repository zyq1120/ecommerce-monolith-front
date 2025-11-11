import apiClient from './axios';

export const authService = {
  register(data) {
    return apiClient.post('/auth/register', data);
  },
  
  verify(email, verificationCode) {
    return apiClient.post('/auth/verify', { email, verificationCode });
  },
  
  resendVerification(email) {
    return apiClient.post('/auth/resend', { email });
  },
  
  login(email, password) {
    return apiClient.post('/auth/login', { email, password });
  },
  
  renewToken(expiredToken) {
    return apiClient.post('/auth/renew-token', { expiredToken });
  },
  
  redeemPassword(email) {
    return apiClient.post('/auth/redeem-password', { email });
  },
  
  resetPassword(token, password) {
    return apiClient.post('/auth/reset-password', { token, password });
  },
};

export const productService = {
  getProducts(params = {}) {
    return apiClient.get('/products', { params });
  },
  
  getProductById(id) {
    return apiClient.get(`/products/${id}`);
  },
  
  createProduct(data) {
    return apiClient.post('/products', data);
  },
  
  updateProduct(id, data) {
    return apiClient.put(`/products/${id}`, data);
  },
  
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`);
  },
};

export const categoryService = {
  getCategories(params = {}) {
    return apiClient.get('/categories', { params });
  },
  
  getCategoryById(id) {
    return apiClient.get(`/categories/${id}`);
  },
  
  createCategory(data) {
    return apiClient.post('/categories', data);
  },
  
  updateCategory(id, data) {
    return apiClient.put(`/categories/${id}`, data);
  },
  
  deleteCategory(id) {
    return apiClient.delete(`/categories/${id}`);
  },
};

export const brandService = {
  getBrands(params = {}) {
    return apiClient.get('/brands', { params });
  },
  
  getBrandById(id) {
    return apiClient.get(`/brands/${id}`);
  },
  
  createBrand(data) {
    return apiClient.post('/brands', data);
  },
  
  updateBrand(id, data) {
    return apiClient.put(`/brands/${id}`, data);
  },
  
  deleteBrand(id) {
    return apiClient.delete(`/brands/${id}`);
  },
};

export const orderService = {
  getOrders(params = {}) {
    return apiClient.get('/orders', { params });
  },
  
  getOrderById(id) {
    return apiClient.get(`/orders/${id}`);
  },
  
  createOrder(data) {
    return apiClient.post('/orders', data);
  },
  
  updateOrderStatus(id, status) {
    return apiClient.put(`/orders/${id}/status`, null, { params: { newStatus: status } });
  },
  
  deleteOrder(id) {
    return apiClient.delete(`/orders/${id}`);
  },
};

export const userService = {
  getCurrentUser() {
    return apiClient.get('/users/me');
  },
  
  getUserById(id) {
    return apiClient.get(`/users/${id}`);
  },
  
  getUsers(params = {}) {
    return apiClient.get('/users', { params });
  },
  
  updateUser(id, data) {
    return apiClient.put(`/users/${id}`, data);
  },
  
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`);
  },
};

export const addressService = {
  getMyAddresses() {
    return apiClient.get('/addresses/me');
  },
  
  getUserAddresses(userId) {
    return apiClient.get(`/addresses/${userId}`);
  },
  
  createAddress(data) {
    return apiClient.post('/addresses', data);
  },
  
  updateAddress(data) {
    return apiClient.put('/addresses', data);
  },
};
