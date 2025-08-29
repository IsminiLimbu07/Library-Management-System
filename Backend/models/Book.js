import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  publishedYear: {
    type: Number
  },
  image: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Pre-save hook to ensure available is set correctly for new books
bookSchema.pre('save', function(next) {
  // If this is a new book and available is not set, set it to quantity
  if (this.isNew && (this.available === undefined || this.available === null)) {
    this.available = this.quantity;
  }
  next();
});

export default mongoose.model('Book', bookSchema);