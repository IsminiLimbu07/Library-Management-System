import express from 'express';
import { authenticateToken, librarianOnly } from '../middleware/auth.js';
import {
  borrowBook,
  returnBook,
  getMyBorrows,
  getAllBorrows,
  getBorrowStats
} from '../controllers/borrowController.js';

const router = express.Router();

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private (Borrower)
router.post('/', authenticateToken, borrowBook);

// @desc    Return a book
// @route   POST /api/borrow/return
// @access  Private
router.post('/return', authenticateToken, returnBook);

// @desc    Get user's borrowed books
// @route   GET /api/borrow/my-books
// @access  Private
router.get('/my-books', authenticateToken, getMyBorrows);

// @desc    Get all borrow records (Librarian only)
// @route   GET /api/borrow/all
// @access  Private (Librarian only)
router.get('/all', authenticateToken, librarianOnly, getAllBorrows);

// @desc    Get borrow statistics (Librarian only)
// @route   GET /api/borrow/stats
// @access  Private (Librarian only)
router.get('/stats', authenticateToken, librarianOnly, getBorrowStats);

export default router;