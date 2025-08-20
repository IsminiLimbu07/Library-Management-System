const express = require('express');
const Book = require('../models/Book');
const { protect, librarianOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Server error fetching books' });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Get book error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(500).json({ error: 'Server error fetching book' });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Librarian only)
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, quantity, description, category, publishedYear } = req.body;

    // Validation
    if (!title || !author || !isbn || !quantity) {
      return res.status(400).json({ error: 'Please provide title, author, ISBN, and quantity' });
    }

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      quantity: parseInt(quantity),
      description,
      category,
      publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
      addedBy: req.user.id
    });

    await book.populate('addedBy', 'name email');

    res.status(201).json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Book with this ISBN already exists' });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ error: errors.join(', ') });
    } else {
      res.status(500).json({ error: 'Server error creating book' });
    }
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian only)
const updateBook = async (req, res) => {
  try {
    const { title, author, isbn, quantity, description, category, publishedYear } = req.body;

    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if ISBN is being changed and if new ISBN already exists
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn, _id: { $ne: req.params.id } });
      if (existingBook) {
        return res.status(400).json({ error: 'Book with this ISBN already exists' });
      }
    }

    // If quantity is being updated, adjust available count
    const currentBorrowed = book.quantity - book.available;
    let newAvailable = book.available;
    
    if (quantity && parseInt(quantity) !== book.quantity) {
      const newQuantity = parseInt(quantity);
      if (newQuantity < currentBorrowed) {
        return res.status(400).json({ 
          error: `Cannot reduce quantity below ${currentBorrowed} (currently borrowed copies)` 
        });
      }
      newAvailable = newQuantity - currentBorrowed;
    }

    const updateData = {
      title: title || book.title,
      author: author || book.author,
      isbn: isbn || book.isbn,
      quantity: quantity ? parseInt(quantity) : book.quantity,
      available: newAvailable,
      description: description !== undefined ? description : book.description,
      category: category || book.category,
      publishedYear: publishedYear ? parseInt(publishedYear) : book.publishedYear
    };

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('addedBy', 'name email');

    res.json({
      success: true,
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found' });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ error: errors.join(', ') });
    } else if (error.code === 11000) {
      res.status(400).json({ error: 'Book with this ISBN already exists' });
    } else {
      res.status(500).json({ error: 'Server error updating book' });
    }
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Librarian only)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if book has active borrows
    const Borrow = require('../models/Borrow');
    const activeBorrows = await Borrow.countDocuments({ 
      bookId: req.params.id, 
      returnDate: null 
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ 
        error: `Cannot delete book. ${activeBorrows} copies are currently borrowed.` 
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(500).json({ error: 'Server error deleting book' });
  }
};

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', protect, librarianOnly, createBook);
router.put('/:id', protect, librarianOnly, updateBook);
router.delete('/:id', protect, librarianOnly, deleteBook);

module.exports = router;