import { validationResult } from 'express-validator';
import Book from '../models/Book.js';

export const listBooks = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { q } = req.query;
    const filter = q
      ? { $or: [
          { title: { $regex: q, $options: 'i' } },
          { author: { $regex: q, $options: 'i' } }
        ]}
      : {};

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { title, author, isbn, quantity, available } = req.body;
    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      quantity,
      available: available ?? quantity
    });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { id } = req.params;
    const updates = req.body;

    const existing = await Book.findById(id);
    if (!existing) return res.status(404).json({ message: 'Book not found' });

    // If changing quantity, ensure available stays consistent:
    if (updates.quantity !== undefined) {
      const borrowedCount = existing.quantity - existing.available;
      if (updates.quantity < borrowedCount) {
        return res.status(400).json({ message: 'Quantity cannot be less than number of borrowed copies' });
      }
      // If increasing quantity and available not explicitly set, increase available by delta
      if (updates.available === undefined) {
        const delta = updates.quantity - existing.quantity;
        updates.available = Math.max(0, existing.available + delta);
      }
    }

    // If explicitly setting available, ensure 0 <= available <= quantity
    if (updates.available !== undefined) {
      const qty = updates.quantity !== undefined ? updates.quantity : existing.quantity;
      if (updates.available < 0 || updates.available > qty) {
        return res.status(400).json({ message: 'Available must be between 0 and quantity' });
      }
    }

    if (updates.isbn) updates.isbn = updates.isbn.trim();
    if (updates.title) updates.title = updates.title.trim();
    if (updates.author) updates.author = updates.author.trim();

    const updated = await Book.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    // Handle duplicate ISBN
    if (err.code === 11000 && err.keyPattern?.isbn) {
      err.status = 400;
      err.message = 'ISBN already exists';
    }
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const borrowedCount = book.quantity - book.available;
    if (borrowedCount > 0) {
      return res.status(400).json({ message: 'Cannot delete: copies are currently borrowed' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
};
