import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import borrowRoutes from './routes/borrow.js';

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - simplified
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Apply rate limiting to API routes only
app.use('/api/', limiter);

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Allow more attempts for dev
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Enhanced global error handler
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  console.error('Stack trace:', error.stack);
  
  let statusCode = error.statusCode || 500;
  let errorMessage = 'Server Error';
  
  // Handle specific MongoDB errors
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

// Store server instance for proper cleanup
let serverInstance;

// Try to use PORT, fallback to next available if in use
const DEFAULT_PORT = process.env.PORT || 5000;

function startServer(port) {
  serverInstance = app.listen(port, () => {
    console.log(`\n🚀 Library Management System API Server Running!\n📡 Port: ${port}\n🌍 Environment: ${process.env.NODE_ENV || 'development'}\n📱 Health Check: http://localhost:${port}/health\n  `);
  });
  
  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      throw err;
    }
  });
}

startServer(DEFAULT_PORT);

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