import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = express.Router();

// @desc    Get all books
// @route   GET /api/books
// @access  Public
router.get('/', getBooks);

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
router.get('/:id', getBook);

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Librarian only)
router.post('/', authenticateToken, authorize('librarian'), createBook);

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian only)
router.put('/:id', authenticateToken, authorize('librarian'), updateBook);

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Librarian only)
router.delete('/:id', authenticateToken, authorize('librarian'), deleteBook);

export default router;