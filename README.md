# E-Commerce Monolith Frontend

A modern Vue 3 frontend application for the e-commerce monolith backend built with Spring Boot 3.

## 🚀 Features

- **User Authentication**
  - User registration with email verification
  - Login/Logout functionality
  - Password reset and recovery
  - JWT token management with automatic renewal

- **Product Browsing**
  - Product listing with pagination
  - Advanced search and filtering (by category, brand, name)
  - Detailed product view
  - Product images and descriptions

- **Shopping Cart**
  - Add/remove products
  - Update quantities
  - Persistent cart (localStorage)
  - Real-time total calculation

- **Order Management**
  - Checkout process
  - Address management
  - Order history
  - Order tracking

- **User Profile**
  - View and update profile information
  - Manage multiple shipping addresses
  - View order history

- **Admin Dashboard** (Coming Soon)
  - Product management
  - Order management
  - User management
  - Analytics

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Axios** - HTTP client for API requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see [ecommerce-monolith-backend](https://github.com/mashisdev/ecommerce-monolith-backend))

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/zyq1120/ecommerce-monolith-front.git
cd ecommerce-monolith-front
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   └── Navbar.vue      # Navigation bar component
├── views/              # Page components
│   ├── Home.vue        # Home page
│   ├── Login.vue       # Login page
│   ├── Register.vue    # Registration page
│   ├── Verify.vue      # Email verification page
│   ├── ForgotPassword.vue
│   ├── ResetPassword.vue
│   ├── Products.vue    # Product listing
│   ├── ProductDetail.vue
│   ├── Cart.vue        # Shopping cart
│   ├── Checkout.vue    # Checkout process
│   ├── Orders.vue      # Order history
│   ├── OrderDetail.vue # Order details
│   ├── Profile.vue     # User profile
│   └── admin/
│       └── AdminDashboard.vue
├── services/           # API service layer
│   ├── api.js         # Axios configuration
│   ├── auth.service.js
│   ├── product.service.js
│   ├── order.service.js
│   ├── user.service.js
│   ├── category.service.js
│   ├── brand.service.js
│   └── payment.service.js
├── stores/            # Pinia stores
│   ├── auth.js       # Authentication state
│   └── cart.js       # Shopping cart state
├── router/           # Vue Router configuration
│   └── index.js
├── App.vue          # Root component
└── main.js          # Application entry point
```

## 🔐 Authentication Flow

1. **Registration**: User registers with email, firstname, lastname, and password
2. **Verification**: System sends verification code to email
3. **Login**: User logs in with verified credentials
4. **Token Management**: JWT tokens are automatically managed and renewed

## 🛒 Shopping Flow

1. Browse products on the home page or products listing
2. Add products to cart
3. View and modify cart
4. Proceed to checkout (requires login)
5. Select or add shipping address
6. Place order
7. View order confirmation and track order

## 🔗 Backend Integration

This frontend is designed to work with the [ecommerce-monolith-backend](https://github.com/mashisdev/ecommerce-monolith-backend) API.

Make sure the backend is running and configured properly:

1. Backend should be running on `http://localhost:8080` (or update `VITE_API_BASE_URL`)
2. CORS should be enabled for the frontend URL
3. All required environment variables should be set in the backend

### API Endpoints Used

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Users**: `/api/users/*`
- **Addresses**: `/api/addresses/*`
- **Categories**: `/api/categories/*`
- **Brands**: `/api/brands/*`
- **Payments**: `/api/payments/*`

## 🎨 Customization

### Styling

The application uses custom CSS with a modern, responsive design. You can customize the colors and styles in:
- `src/style.css` - Global styles
- Component `<style>` sections - Component-specific styles

### Adding New Features

1. Create service in `src/services/`
2. Create store in `src/stores/` if needed
3. Create view in `src/views/`
4. Add route in `src/router/index.js`

## 🐛 Known Issues

- Admin dashboard is a placeholder (features coming soon)
- Payment integration needs to be implemented
- Product images use placeholder if not available

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👥 Authors

- Frontend: zyq1120
- Backend: [mashisdev](https://github.com/mashisdev)

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Backend repository for the comprehensive API

