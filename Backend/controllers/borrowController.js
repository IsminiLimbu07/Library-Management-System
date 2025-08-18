import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';

export const borrowBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0].msg });

  const { bookId } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check already borrowed & not returned
    const active = await Borrow.findOne({ userId, bookId, returnDate: null }).session(session);
    if (active) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    // Atomically decrement if available > 0
    const book = await Book.findOneAndUpdate(
      { _id: bookId, available: { $gt: 0 } },
      { $inc: { available: -1 } },
      { new: true, session }
    );
    if (!book) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'No copies available' });
    }

    const borrow = await Borrow.create(
      [{ userId, bookId, borrowDate: new Date(), returnDate: null }],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ message: 'Borrowed successfully', borrow: borrow[0], book });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

export const returnBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0].msg });

  const { bookId } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const borrow = await Borrow.findOne({ userId, bookId, returnDate: null }).session(session);
    if (!borrow) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Active borrow record not found' });
    }

    // Set return date
    borrow.returnDate = new Date();
    await borrow.save({ session });

    // Increment availability
    const book = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { available: 1 } },
      { new: true, session }
    );

    await session.commitTransaction();
    res.json({ message: 'Returned successfully', borrow, book });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

export const listBorrows = async (req, res, next) => {
  try {
    const records = await Borrow.find()
      .populate('userId', 'name email role')
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    next(err);
  }
};
