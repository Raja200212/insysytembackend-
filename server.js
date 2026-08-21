const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDb } = require('./config/db');

const { swaggerUi, specs } = require('./config/swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Policy Configuration - Allow all local origins during development
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets / images if needed
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // Allows direct /api/login, /api/me, /api/logout, /api/register

app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/subcategories', require('./routes/subcategoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Website Electron Node.js + Express + MySQL Server is running cleanly!',
    timestamp: new Date().toISOString()
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send('<h1>Website Electron Node.js Express API Server</h1><p>Visit <code>/api/health</code> for API status.</p>');
});

// Initialize MySQL DB & Start Server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(` 🚀 Node.js Express MySQL Backend Server Running!`);
    console.log(` 🌐 URL: http://localhost:${PORT}`);
    console.log(` 📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===================================================`);
  });
});
