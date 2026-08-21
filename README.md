# Node.js, Express & MySQL Backend (`nodebackend`)

This directory contains a complete REST API backend created with **Node.js**, **Express**, and **MySQL** (`mysql2`).

---

## 📁 Directory Structure

```
nodebackend/
├── config/
│   ├── db.js              # MySQL Connection Pool & Auto-Initialization
│   └── schema.sql          # Complete MySQL Database Tables & Seed Data
├── controllers/
│   ├── authController.js    # Register, Login, JWT Profile
│   ├── categoryController.js# Categories & Subcategories
│   ├── productController.js # Product CRUD, Filter & Search
│   ├── cartController.js    # Shopping Cart Operations
│   ├── reviewController.js  # Product Reviews & Ratings
│   ├── serviceController.js # Service Requests & Status Updates
│   └── customerController.js# Customer Management
├── middleware/
│   └── auth.js            # JWT Authentication & Admin Guards
├── routes/
│   ├── authRoutes.js      # /api/auth
│   ├── categoryRoutes.js  # /api/categories
│   ├── productRoutes.js   # /api/products
│   ├── cartRoutes.js      # /api/cart
│   ├── reviewRoutes.js    # /api/reviews
│   ├── serviceRoutes.js   # /api/services
│   └── customerRoutes.js  # /api/customers
├── .env                   # Environment Variables (DB credentials, JWT Secret)
├── package.json           # Dependencies & Scripts
└── server.js              # Express Application Entry Point
```

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
In your terminal, navigate to the `nodebackend` folder and run:
```bash
npm install
```

### 2. Configure Database (`.env`)
Ensure MySQL server (e.g., XAMPP, WAMP, MySQL Workbench, or local MySQL service) is running. Update `.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=website_electron
JWT_SECRET=website_electron_super_secret_jwt_key_2026
```

### 3. Run the Server
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server Health Status | Public |
| `POST` | `/api/auth/register` | Register New User | Public |
| `POST` | `/api/auth/login` | User Login & Get JWT Token | Public |
| `GET` | `/api/auth/profile` | Get Logged-in User Profile | User Token |
| `GET` | `/api/categories` | Get All Categories & Subcategories | Public |
| `GET` | `/api/products` | Get Products (Supports `?category_id=`, `?search=`, `?is_featured=1`) | Public |
| `GET` | `/api/products/:id` | Get Single Product Details & Specs | Public |
| `POST` | `/api/products` | Create Product | Admin Token |
| `GET` | `/api/cart` | Get User Cart Items | User Token |
| `POST` | `/api/cart/add` | Add Item to Cart | User Token |
| `GET` | `/api/services` | Get Service Tickets | Public |
| `POST` | `/api/services` | Submit Service Request | Public |
