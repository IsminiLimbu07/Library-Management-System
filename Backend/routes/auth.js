import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/authController.js';

const router = express.Router();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticateToken, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticateToken, updateUserProfile);

export default router;
