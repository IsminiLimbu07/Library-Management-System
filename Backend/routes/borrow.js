import express from 'express';
import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';
import { authenticateToken, librarianOnly } from '../middleware/auth.js';

const router = express.Router();

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private (Borrower)
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; // FIXED: Use _id consistently

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
      returnDate: null
    });

    if (existingBorrow) {
      return res.status(400).json({ error: 'You have already borrowed this book' });
    }

    // Check borrowing limit (max 5 books per user)
    const activeBorrows = await Borrow.countDocuments({
      userId,
      returnDate: null
    });

    if (activeBorrows >= 5) {
      return res.status(400).json({ error: 'Borrowing limit reached. You can borrow maximum 5 books.' });
    }

    // Create borrow record
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
    
    const borrow = await Borrow.create({
      userId,
      bookId,
      dueDate
    });

    // Update book availability
    book.available -= 1;
    await book.save();

    // Populate the borrow record with book and user details
    await borrow.populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'userId', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      borrow
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({ error: 'Server error borrowing book' });
  }
};

// @desc    Return a book
// @route   POST /api/borrow/return
// @access  Private
const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    if (!borrowId) {
      return res.status(400).json({ error: 'Borrow ID is required' });
    }

    // Find the borrow record
    const borrow = await Borrow.findById(borrowId).populate([
      { path: 'bookId', select: 'title author isbn' },
      { path: 'userId', select: 'name email' }
    ]);

    if (!borrow) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    // Check if the book is already returned
    if (borrow.returnDate) {
      return res.status(400).json({ error: 'Book is already returned' });
    }

    // Check if the user owns this borrow record (unless they're a librarian)
    if (req.user.role !== 'librarian' && borrow.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to return this book' });
    }

    // Update borrow record
    borrow.returnDate = new Date();
    borrow.status = 'returned';
    await borrow.save();

    // Update book availability
    const book = await Book.findById(borrow.bookId._id);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.json({
      success: true,
      borrow
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ error: 'Server error returning book' });
  }
};

// @desc    Get user's borrowed books
// @route   GET /api/borrow/my-books
// @access  Private
const getMyBorrows = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { userId: req.user._id }; // FIXED: Use _id consistently

    // Filter by status
    if (status === 'borrowed') {
      query.returnDate = null;
    } else if (status === 'returned') {
      query.returnDate = { $ne: null };
    }

    const borrows = await Borrow.find(query)
      .populate([
        { path: 'bookId', select: 'title author isbn category' },
        { path: 'userId', select: 'name email' }
      ])
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: borrows.length,
      borrows
    });
  } catch (error) {
    console.error('Get my borrows error:', error);
    res.status(500).json({ error: 'Server error fetching borrowed books' });
  }
};

// @desc    Get all borrow records (Librarian only)
// @route   GET /api/borrow/all
// @access  Private (Librarian only)
const getAllBorrows = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    let query = {};

    // Filter by status
    if (status === 'active') {
      query.returnDate = null;
    } else if (status === 'returned') {
      query.returnDate = { $ne: null };
    } else if (status === 'overdue') {
      query.returnDate = null;
      query.dueDate = { $lt: new Date() };
    }

    const borrows = await Borrow.find(query)
      .populate([
        { path: 'bookId', select: 'title author isbn category' },
        { path: 'userId', select: 'name email' }
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Borrow.countDocuments(query);

    res.json({
      success: true,
      count: borrows.length,
      total,
      borrows
    });
  } catch (error) {
    console.error('Get all borrows error:', error);
    res.status(500).json({ error: 'Server error fetching borrow records' });
  }
};

// @desc    Get borrow statistics (Librarian only)
// @route   GET /api/borrow/stats
// @access  Private (Librarian only)
const getBorrowStats = async (req, res) => {
  try {
    const totalBorrows = await Borrow.countDocuments();
    const activeBorrows = await Borrow.countDocuments({ returnDate: null });
    const overdueBorrows = await Borrow.countDocuments({
      returnDate: null,
      dueDate: { $lt: new Date() }
    });
    const returnedBorrows = await Borrow.countDocuments({ returnDate: { $ne: null } });

    // Popular books (most borrowed)
    const popularBooks = await Borrow.aggregate([
      {
        $group: {
          _id: '$bookId',
          borrowCount: { $sum: 1 }
        }
      },
      { $sort: { borrowCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
        }
      },
      { $unwind: '$book' },
      {
        $project: {
          title: '$book.title',
          author: '$book.author',
          borrowCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalBorrows,
        activeBorrows,
        overdueBorrows,
        returnedBorrows,
        popularBooks
      }
    });
  } catch (error) {
    console.error('Get borrow stats error:', error);
    res.status(500).json({ error: 'Server error fetching statistics' });
  }
};

router.post('/', authenticateToken, borrowBook);
router.post('/return', authenticateToken, returnBook);
router.get('/my-books', authenticateToken, getMyBorrows);
router.get('/all', authenticateToken, librarianOnly, getAllBorrows);
router.get('/stats', authenticateToken, librarianOnly, getBorrowStats);

export default router;