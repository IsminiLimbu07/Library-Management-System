import express from 'express';
import Book from '../models/Book.js';
import { authenticateToken, requireLibrarian } from '../middleware/auth.js';

const router = express.Router();

// Get all books (with search and filter)
router.get('/', async (req, res) => {
  try {
    const { search, author, category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Filter by author
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Book.countDocuments(query);

    res.json({
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new book (Librarian only)
router.post('/', authenticateToken, requireLibrarian, async (req, res) => {
  try {
    const { title, author, isbn, quantity, description, category, publishedYear } = req.body;

    // Validation
    if (!title || !author || !isbn || quantity === undefined) {
      return res.status(400).json({ 
        error: 'Please provide title, author, ISBN, and quantity' 
      });
    }

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ 
        error: 'Book with this ISBN already exists' 
      });
    }

    const book = new Book({
      title,
      author,
      isbn,
      quantity: parseInt(quantity),
      available: parseInt(quantity),
      description,
      category,
      publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
    });

    await book.save();

    res.status(201).json({
      message: 'Book added successfully',
      book,
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update book (Librarian only)
router.put('/:id', authenticateToken, requireLibrarian, async (req, res) => {
  try {
    const { title, author, isbn, quantity, description, category, publishedYear } = req.body;
    const bookId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // If quantity is being updated, adjust available copies
    if (quantity !== undefined) {
      const difference = parseInt(quantity) - book.quantity;
      book.available = Math.max(0, book.available + difference);
      book.quantity = parseInt(quantity);
    }

    // Update other fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn && isbn !== book.isbn) {
      // Check if new ISBN is unique
      const existingBook = await Book.findOne({ isbn, _id: { $ne: bookId } });
      if (existingBook) {
        return res.status(400).json({ error: 'ISBN already exists' });
      }
      book.isbn = isbn;
    }
    if (description !== undefined) book.description = description;
    if (category !== undefined) book.category = category;
    if (publishedYear !== undefined) book.publishedYear = parseInt(publishedYear);

    await book.save();

    res.json({
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete book (Librarian only)
router.delete('/:id', authenticateToken, requireLibrarian, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
