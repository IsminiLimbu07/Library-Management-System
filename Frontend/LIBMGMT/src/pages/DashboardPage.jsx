import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user, getAuthHeader, isLibrarian } = useAuth();
  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch available books
      const booksResponse = await fetch('/api/books');
      const booksData = await booksResponse.json();
      
      if (booksResponse.ok) {
        setBooks(booksData.books || []);
      }

      // Fetch user's borrowed books
      if (!isLibrarian) {
        const borrowsResponse = await fetch('/api/borrow/my-books?status=borrowed', {
          headers: getAuthHeader(),
        });
        const borrowsData = await borrowsResponse.json();
        
        if (borrowsResponse.ok) {
          setMyBorrows(borrowsData.borrows || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Book borrowed successfully!');
        fetchData(); // Refresh data
      } else {
        alert(data.error || 'Failed to borrow book');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to borrow book');
    }
  };

  const handleReturnBook = async (borrowId) => {
    try {
      const response = await fetch('/api/borrow/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ borrowId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Book returned successfully!');
        fetchData(); // Refresh data
      } else {
        alert(data.error || 'Failed to return book');
      }
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book');
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setAuthorFilter('');
    setCategoryFilter('');
    setAvailableOnly(false);
  };

  // Get unique authors and categories for filters
  const uniqueAuthors = [...new Set(books.map(book => book.author))].sort();
  const uniqueCategories = [...new Set(books.map(book => book.category))].sort();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuthor = !authorFilter || book.author === authorFilter;
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    const matchesAvailability = !availableOnly || book.available > 0;
    
    return matchesSearch && matchesAuthor && matchesCategory && matchesAvailability;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            Search
          </button>
        </div>

        {/* Filters Row */}
        <div className="filters-row">
          <select
            className="filter-select"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            <option value="">Filter by author...</option>
            {uniqueAuthors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Filter by category...</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="available-filter">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available only
            </label>
            <button className="reset-button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* My Borrowed Books Section (for borrowers) */}
      {!isLibrarian && myBorrows.length > 0 && (
        <div className="borrowed-books-section">
          <h2 className="section-title">My Borrowed Books</h2>
          <div className="books-grid">
            {myBorrows.map((borrow) => (
              <div key={borrow._id} className="book-card">
                <h3 className="book-title">{borrow.bookId?.title}</h3>
                <p className="book-author">by {borrow.bookId?.author}</p>
                <p className="book-isbn">ISBN: {borrow.bookId?.isbn}</p>
                <div className="book-category">
                  <span className="category-badge">{borrow.bookId?.category}</span>
                </div>
                <p className="due-date">
                  Due: {new Date(borrow.dueDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleReturnBook(borrow._id)}
                  className="return-book-button"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Books Grid */}
      <div className="books-section">
        {filteredBooks.length === 0 ? (
          <div className="no-books-message">
            <p>
              {searchTerm || authorFilter || categoryFilter || availableOnly 
                ? 'No books found matching your filters.' 
                : 'No books available.'}
            </p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-isbn">ISBN: {book.isbn}</p>
                
                <div className="book-category">
                  <span className="category-badge">{book.category}</span>
                </div>
                
                <div className="availability-section">
                  <div className="availability-count">
                    {book.available} / {book.quantity}
                  </div>
                  <div className="availability-status">
                    ✓ Available
                  </div>
                </div>

                <button
                  onClick={() => handleBorrowBook(book._id)}
                  className="borrow-book-button"
                  disabled={book.available === 0 || isLibrarian}
                >
                  Borrow Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
