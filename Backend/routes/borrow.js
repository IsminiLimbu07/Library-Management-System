import express from 'express';
import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';
import { authenticateToken, requireLibrarian } from '../middleware/auth.js';

const router = express.Router();

// Borrow a book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    if (!bookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.available <= 0) {
      return res.status(400).json({ error: 'Book is not available for borrowing' });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await Borrow.findOne({
      userId,
      bookId,
      returnDate: null,
    });

    if (existingBorrow) {
      return res.status(400).json({ error: 'You have already borrowed this book' });
    }

    // Create borrow record
    const borrow = new Borrow({
      userId,
      bookId,
    });

    await borrow.save();

    // Decrease available copies
    book.available -= 1;
    await book.save();

    // Populate book and user details
    await borrow.populate('bookId', 'title author isbn');
    await borrow.populate('userId', 'name email');

    res.status(201).json({
      message: 'Book borrowed successfully',
      borrow,
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Return a book
router.post('/return', authenticateToken, async (req, res) => {
  try {
    const { borrowId } = req.body;
    const userId = req.user._id;

    if (!borrowId) {
      return res.status(400).json({ error: 'Borrow ID is required' });
    }

    // Find the borrow record
    const borrow = await Borrow.findOne({
      _id: borrowId,
      userId,
      returnDate: null,
    }).populate('bookId', 'title author isbn');

    if (!borrow) {
      return res.status(404).json({ error: 'Borrow record not found or book already returned' });
    }

    // Update borrow record
    borrow.returnDate = new Date();
    borrow.status = 'returned';
    await borrow.save();

    // Increase available copies
    const book = await Book.findById(borrow.bookId._id);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.json({
      message: 'Book returned successfully',
      borrow,
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's borrowed books
router.get('/my-books', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { status = 'all' } = req.query;

    let query = { userId };
    
    if (status === 'borrowed') {
      query.returnDate = null;
    } else if (status === 'returned') {
      query.returnDate = { $ne: null };
    }

    const borrows = await Borrow.find(query)
      .populate('bookId', 'title author isbn')
      .sort({ borrowDate: -1 });

    res.json({ borrows });
  } catch (error) {
    console.error('Get user borrows error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all borrow records (Librarian only)
router.get('/all', authenticateToken, requireLibrarian, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;

    let query = {};
    
    if (status === 'borrowed') {
      query.returnDate = null;
    } else if (status === 'returned') {
      query.returnDate = { $ne: null };
    } else if (status === 'overdue') {
      query.returnDate = null;
      query.dueDate = { $lt: new Date() };
    }

    const skip = (page - 1) * limit;

    const borrows = await Borrow.find(query)
      .populate('userId', 'name email')
      .populate('bookId', 'title author isbn')
      .sort({ borrowDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Borrow.countDocuments(query);

    res.json({
      borrows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all borrows error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
