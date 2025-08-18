import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed',
  },
}, {
  timestamps: true,
});

// Set due date to 14 days from borrow date if not specified
borrowSchema.pre('save', function(next) {
  if (!this.dueDate && !this.returnDate) {
    this.dueDate = new Date(this.borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model('Borrow', borrowSchema);
