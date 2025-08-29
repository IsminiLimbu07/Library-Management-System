import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  }
}, {
  timestamps: true
});

// Set due date to 14 days from borrow date if not specified
borrowSchema.pre('save', function(next) {
  if (this.isNew && !this.dueDate) {
    this.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
  }
  next();
});

// Update status based on dates
borrowSchema.pre('save', function(next) {
  const now = new Date();
  if (this.returnDate) {
    this.status = 'returned';
  } else if (this.dueDate < now) {
    this.status = 'overdue';
  } else {
    this.status = 'borrowed';
  }
  next();
});

// Prevent borrowing the same book twice
borrowSchema.index({ userId: 1, bookId: 1, returnDate: 1 });

export default mongoose.model('Borrow', borrowSchema);