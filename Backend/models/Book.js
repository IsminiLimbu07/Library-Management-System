import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  available: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  publishedYear: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Ensure available copies don't exceed total quantity
bookSchema.pre('save', function(next) {
  if (this.available > this.quantity) {
    this.available = this.quantity;
  }
  next();
});

export default mongoose.model('Book', bookSchema);
