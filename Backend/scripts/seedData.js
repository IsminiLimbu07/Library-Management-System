const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Import models
const User = require('../models/User');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Book.deleteMany();
    await Borrow.deleteMany();

    // Create demo users
    console.log('Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const librarian = await User.create({
      name: 'Demo Librarian',
      email: 'librarian@demo.com',
      password: hashedPassword,
      role: 'librarian'
    });

    const borrower = await User.create({
      name: 'Demo Borrower',
      email: 'borrower@demo.com',
      password: hashedPassword,
      role: 'borrower'
    });

    // Create demo books
    console.log('Creating demo books...');
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0-7432-7356-5',
        quantity: 5,
        description: 'A classic American novel set in the summer of 1922.',
        category: 'Fiction',
        publishedYear: 1925,
        addedBy: librarian._id
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0-06-112008-4',
        quantity: 3,
        description: 'A gripping tale of racial injustice and childhood innocence.',
        category: 'Fiction',
        publishedYear: 1960,
        addedBy: librarian._id
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        quantity: 4,
        description: 'A handbook of agile software craftsmanship.',
        category: 'Technology',
        publishedYear: 2008,
        addedBy: librarian._id
      },
      {
        title: 'The Art of War',
        author: 'Sun Tzu',
        isbn: '978-1-59030-963-7',
        quantity: 2,
        description: 'Ancient Chinese military treatise.',
        category: 'History',
        publishedYear: -500,
        addedBy: librarian._id
      },
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        isbn: '978-0-7475-3269-9',
        quantity: 6,
        description: 'The first book in the magical Harry Potter series.',
        category: 'Fiction',
        publishedYear: 1997,
        addedBy: librarian._id
      },
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        isbn: '978-0-262-03384-8',
        quantity: 2,
        description: 'Comprehensive introduction to algorithms and data structures.',
        category: 'Technology',
        publishedYear: 2009,
        addedBy: librarian._id
      }
    ];

    const createdBooks = await Book.insertMany(books);

    // Create some demo borrow records
    console.log('Creating demo borrow records...');
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days later

    await Borrow.create({
      userId: borrower._id,
      bookId: createdBooks[0]._id, // The Great Gatsby
      borrowDate,
      dueDate
    });

    // Update book availability
    createdBooks[0].available -= 1;
    await createdBooks[0].save();

    console.log('✅ Demo data seeded successfully!');
    console.log('\n📚 Demo Accounts:');
    console.log('Librarian: librarian@demo.com / password123');
    console.log('Borrower: borrower@demo.com / password123');
    console.log(`\n📖 Created ${createdBooks.length} demo books`);
    console.log('🔄 Created 1 demo borrow record');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
  process.exit();
};

runSeeder();