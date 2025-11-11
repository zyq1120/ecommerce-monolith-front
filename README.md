# E-commerce Monolith Frontend

A modern e-commerce frontend application built with Vue 3 and Vite, designed to work with the [E-Commerce Monolith Backend](https://github.com/mashisdev/ecommerce-monolith-backend).

## Features

- 🛍️ Product browsing and search
- 🛒 Shopping cart functionality
- 👤 User authentication (register, login, email verification)
- 📦 Order management
- 👨‍💼 Admin panel for managing products, categories, and brands
- 🎨 Modern, responsive UI
- 🔐 JWT-based authentication with automatic token refresh

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Axios** - HTTP client for API requests

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see [backend repository](https://github.com/mashisdev/ecommerce-monolith-backend))

## Installation

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

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/                  # API service layer
│   ├── axios.js         # Axios configuration with interceptors
│   └── services.js      # API service methods
├── components/          # Reusable components
│   ├── common/         # Common components
│   └── layout/         # Layout components (Header, Footer)
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
│   ├── auth.js        # Authentication store
│   └── cart.js        # Shopping cart store
├── views/              # Page components
│   ├── auth/          # Authentication pages
│   ├── products/      # Product pages
│   ├── cart/          # Shopping cart pages
│   ├── orders/        # Order pages
│   ├── profile/       # User profile pages
│   └── admin/         # Admin panel pages
├── App.vue            # Root component
└── main.js            # Application entry point
```

## Features Overview

### User Features
- Browse products with filtering and pagination
- View product details
- Add items to shopping cart
- User registration and email verification
- Login/logout functionality
- Password reset
- View order history
- Manage user profile and addresses

### Admin Features
- Product management (CRUD operations)
- Category management
- Brand management
- Order management

## API Integration

This frontend integrates with the following backend endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/categories/*` - Category management
- `/api/brands/*` - Brand management
- `/api/orders/*` - Order management
- `/api/users/*` - User management
- `/api/addresses/*` - Address management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Related Projects

- [E-Commerce Monolith Backend](https://github.com/mashisdev/ecommerce-monolith-backend) - Spring Boot 3 backend API

