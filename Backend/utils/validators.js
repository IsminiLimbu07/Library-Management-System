import { body, param, query } from 'express-validator';
import Book from '../models/Book.js';
import User from '../models/User.js';
export const registerValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').notEmpty().withMessage('Name required'),
  body('role').isIn(['librarian', 'borrower']).withMessage('Role must be librarian or borrower')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email or password'),
  body('password').isString().withMessage('Invalid email or password')
];

export const bookCreateValidator = [
  body('title').isString().notEmpty(),
  body('author').isString().notEmpty(),
  body('isbn').isString().notEmpty()
    .custom(async (isbn) => {
      const exists = await Book.findOne({ isbn: isbn.trim() });
      if (exists) throw new Error('ISBN already exists');
      return true;
    }),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('available').optional().isInt({ min: 0 }).withMessage('Available must be a non-negative integer')
];

export const bookUpdateValidator = [
  param('id').isMongoId(),
  body('title').optional().isString().notEmpty(),
  body('author').optional().isString().notEmpty(),
  body('isbn').optional().isString().notEmpty(),
  body('quantity').optional().isInt({ min: 1 }),
  body('available').optional().isInt({ min: 0 })
];

export const listBooksValidator = [
  query('q').optional().isString()
];

export const borrowValidator = [
  body('bookId').isMongoId().withMessage('bookId is required')
];

export const returnValidator = [
  body('bookId').isMongoId().withMessage('bookId is required')
];
