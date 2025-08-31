import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import database connection
import connectDB from './config/database.js';

// Import controllers - using your exact file paths
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} from './controllers/authController.js';

import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} from './controllers/bookController.js';

import {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
  getBorrowStats
} from './controllers/borrowController.js';

// Import middleware - using your exact file paths
import { authenticateToken, authorize, librarianOnly } from './middleware/auth.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// ============================================
// PROXY TRUST CONFIGURATION (FIX FOR RENDER)
// ============================================
// CRITICAL: This must be set BEFORE any middleware
app.set('trust proxy', 1); // Trust only the first proxy (Render's load balancer)

// ============================================
// MIDDLEWARE SETUP (Similar to teacher's style)
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration - enabling CORS for all routes
app.use(cors({
  origin: [
    'http://localhost:3000',     // React dev server
    'http://localhost:5173',     // Vite dev server
    'http://localhost:8081',     // Expo dev server (your current frontend)
    'http://localhost:19006',    // Expo web dev server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8081',     // Alternative localhost for Expo
    'http://127.0.0.1:19006',
    'https://isminibooksphere.netlify.app'
  ],
  credentials: true
}));

// Body parser middleware - for reading JSON data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware - protect against spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ============================================
// ROUTES (Simple and clear like teacher's code)
// ============================================

// FIXED: Public health check route (no authentication required)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Library Management System API is running successfully!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check route - to test if server is running
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Library Management System API is running successfully!',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes (similar to teacher's /auth route)
app.post('/api/auth/register', registerUser);          // Register new user
app.post('/api/auth/login', loginUser);                // Login user
app.get('/api/auth/me', authenticateToken, getUserProfile);              // Get user profile
app.put('/api/auth/profile', authenticateToken, updateUserProfile);      // Update user profile

// Book Management Routes (similar to teacher's /employee routes)
app.post('/api/books', authenticateToken, authorize('librarian'), createBook);     // Create new book (librarian only)
app.get('/api/books', getBooks);                                                   // Get all books (public)
app.get('/api/books/:id', getBook);                                               // Get book by ID (public)
app.put('/api/books/:id', authenticateToken, authorize('librarian'), updateBook);  // Update book (librarian only)
app.delete('/api/books/:id', authenticateToken, authorize('librarian'), deleteBook); // Delete book (librarian only)

// Borrow Management Routes
app.post('/api/borrow', authenticateToken, borrowBook);                           // Borrow a book
app.post('/api/borrow/return', authenticateToken, returnBook);                    // Return a book
app.get('/api/borrow/my-books', authenticateToken, getMyBorrows);                 // Get user's borrowed books
app.get('/api/borrow/all', authenticateToken, librarianOnly, getAllBorrows);      // Get all borrow records (librarian only)
app.get('/api/borrow/stats', authenticateToken, librarianOnly, getBorrowStats);   // Get borrow statistics (librarian only)

// Route to verify Token (exactly like teacher's style)
app.get('/api/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token verified successfully!" });
});

// ============================================
// ERROR HANDLING (Simple like teacher's code)
// ============================================

// Handle 404 routes - when route is not found
app.use('*', (req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`
  });
});

// Global error handler - catch all errors
app.use((error, req, res, next) => {
  console.log("Error occurred:", error.message);
  
  let statusCode = error.statusCode || 500;
  let errorMessage = error.message || 'Server Error';
  
  // Handle common database errors (simple approach)
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
  } else if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyPattern)[0];
    errorMessage = `${field} already exists`;
  } else if (error.name === 'CastError') {
    statusCode = 404;
    errorMessage = 'Resource not found';
  }

  res.status(statusCode).json({
    error: errorMessage
  });
});

// ============================================
// SERVER STARTUP (Exactly like teacher's style)
// ============================================

// Starting the server (simple approach like teacher's code)
app.listen(PORT, () => {
  console.log("🚀 Library Management System Server is running on port", PORT);
  console.log("📱 Health Check: http://localhost:" + PORT + "/health");
  console.log("🌍 Environment:", process.env.NODE_ENV || 'development');
});

// Handle unhandled promise rejections (basic error handling)
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err.message);
  process.exit(1);
});

export default app;