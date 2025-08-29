import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import database connection
import connectDB from './config/database.js';

// Import route files
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import borrowRoutes from './routes/borrow.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security middleware - adds various security headers
app.use(helmet());

// CORS configuration - allows frontend to communicate with backend
app.use(cors({
  origin: [
    'http://localhost:3000',     // React dev server
    'http://localhost:5173',     // Vite dev server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser middleware - enables reading JSON and form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware - protects against spam/abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes window
  max: 100,                   // Limit to 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Special rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes window
  max: 50,                    // Allow 50 auth attempts per window
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// ============================================
// ROUTES SETUP
// ============================================

// Health check route - used to verify server is running
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes - connect route handlers to their respective endpoints
app.use('/api/auth', authLimiter, authRoutes);     // Authentication routes
app.use('/api/books', bookRoutes);                 // Book management routes  
app.use('/api/borrow', borrowRoutes);              // Book borrowing routes

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Handle 404 routes - when no route matches the requestdc
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Global error handler - catches all unhandled errors
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  console.error('Stack trace:', error.stack);
  
  let statusCode = error.statusCode || 500;
  let errorMessage = 'Server Error';
  
  // Handle specific MongoDB/Mongoose errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
  } else if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyPattern)[0];
    errorMessage = `${field} already exists`;
  } else if (error.name === 'CastError') {
    statusCode = 404;
    errorMessage = 'Resource not found';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorMessage = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    errorMessage = 'Token expired';
  } else if (error.message) {
    errorMessage = error.message;
  }

  // Log detailed error info for debugging
  console.error(`Error details: ${errorMessage} | Status: ${statusCode} | Path: ${req.path} | Method: ${req.method}`);

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// ============================================
// SERVER STARTUP
// ============================================

// Store server instance for proper cleanup
let serverInstance;

// Try to use PORT from environment, fallback to 5000
const DEFAULT_PORT = process.env.PORT || 5000;

// Function to start server with port fallback
function startServer(port) {
  serverInstance = app.listen(port, () => {
    console.log(`\n🚀 Library Management System API Server Running!`);
    console.log(`📡 Port: ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Health Check: http://localhost:${port}/health\n`);
  });
  
  // Handle port already in use error
  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      throw err;
    }
  });
}

// Start the server
startServer(DEFAULT_PORT);

// ============================================
// GRACEFUL SHUTDOWN HANDLING
// ============================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  if (serverInstance) {
    serverInstance.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});

export default app;