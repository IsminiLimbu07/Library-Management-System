const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  available: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Children', 'Reference', 'Other'],
    default: 'Other'
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Published year must be valid'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Set available count to quantity when creating a new book
bookSchema.pre('save', function(next) {
  if (this.isNew) {
    this.available = this.quantity;
  }
  next();
});

// Ensure available count doesn't exceed quantity
bookSchema.pre('save', function(next) {
  if (this.available > this.quantity) {
    this.available = this.quantity;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);