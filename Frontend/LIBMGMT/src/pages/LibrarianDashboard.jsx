import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_BASE_URL } from '../lib/api';

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [error, setError] = useState('');
  
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch books and borrow records in parallel
      const [booksResponse, borrowsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/books`),
        fetch(`${API_BASE_URL}/api/borrow/all`, {
          headers: getAuthHeader()
        })
      ]);

      const booksData = await booksResponse.json();
      const borrowsData = await borrowsResponse.json();

      if (booksResponse.ok) {
        setBooks(booksData.books || []);
      }
      
      if (borrowsResponse.ok) {
        setBorrowRecords(borrowsData.borrows || []);
      }

      if (!booksResponse.ok && !borrowsResponse.ok) {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (response.ok) {
        alert('Book deleted successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = {
    totalBooks: books.length,
    totalCopies: books.reduce((sum, book) => sum + book.quantity, 0),
    availableCopies: books.reduce((sum, book) => sum + book.available, 0),
    borrowedCopies: books.reduce((sum, book) => sum + (book.quantity - book.available), 0),
    activeBorrows: borrowRecords.filter(record => !record.returnDate).length,
    totalBorrows: borrowRecords.length,
    overdueBorrows: borrowRecords.filter(record => 
      !record.returnDate && new Date(record.dueDate) < new Date()
    ).length
  };

  const activeBorrows = borrowRecords.filter(record => !record.returnDate);
  const overdueBorrows = borrowRecords.filter(record => 
    !record.returnDate && new Date(record.dueDate) < new Date()
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="librarian-header">
        <h1 className="librarian-title">Librarian Dashboard</h1>
        <p className="librarian-subtitle">Monitor library operations and manage book collections</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/librarian/add-book" className="action-card action-primary">
          <div className="action-icon">📚</div>
          <h3 className="action-title">Add New Book</h3>
          <p className="action-description">Add books to the collection</p>
        </Link>
        
        <Link to="/librarian/books" className="action-card action-secondary">
          <div className="action-icon">📖</div>
          <h3 className="action-title">Manage Books</h3>
          <p className="action-description">Edit or remove books</p>
        </Link>
        
        <div className="action-card action-disabled">
          <div className="action-icon">📊</div>
          <h3 className="action-title">View Reports</h3>
          <p className="action-description">Analytics and insights</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-value">{stats.totalBooks}</div>
          <div className="stat-label">Total Books</div>
        </div>
        
        <div className="stat-card stat-green">
          <div className="stat-value">{stats.availableCopies}</div>
          <div className="stat-label">Available Copies</div>
        </div>
        
        <div className="stat-card stat-orange">
          <div className="stat-value">{stats.borrowedCopies}</div>
          <div className="stat-label">Borrowed Copies</div>
        </div>
        
        <div className="stat-card stat-red">
          <div className="stat-value">{stats.overdueBorrows}</div>
          <div className="stat-label">Overdue Books</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <div className="tab-nav">
          <button
            onClick={() => setActiveTab('books')}
            className={`tab-button ${activeTab === 'books' ? 'tab-active' : ''}`}
          >
            Manage Books
          </button>
          <button
            onClick={() => setActiveTab('active-borrows')}
            className={`tab-button ${activeTab === 'active-borrows' ? 'tab-active' : ''}`}
          >
            Active Borrows ({stats.activeBorrows})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`tab-button ${activeTab === 'overdue' ? 'tab-active' : ''}`}
          >
            Overdue ({stats.overdueBorrows})
          </button>
        </div>

        <div className="tab-content">
          {/* Books Management Tab */}
          {activeTab === 'books' && (
            <div>
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

              {/* Books Grid */}
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

                        <div className="librarian-actions">
                          <Link
                            to={`/librarian/books/${book._id}/edit`}
                            className="edit-book-button"
                          >
                            Edit Book
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="delete-book-button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Borrows Tab */}
          {activeTab === 'active-borrows' && (
            <div className="borrow-records">
              <h3 className="section-title">Active Borrows</h3>
              {activeBorrows.length === 0 ? (
                <p className="no-data-message">No active borrows</p>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Borrower</th>
                        <th>Book</th>
                        <th>Borrow Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBorrows.map((borrow) => {
                        const isOverdue = new Date(borrow.dueDate) < new Date();
                        return (
                          <tr key={borrow._id}>
                            <td>
                              <div className="borrower-info">
                                <div className="borrower-name">
                                  {borrow.userId?.name || 'Unknown User'}
                                </div>
                                <div className="borrower-email">
                                  {borrow.userId?.email || 'No email'}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="book-info">
                                <div className="borrow-book-title">
                                  {borrow.bookId?.title || 'Unknown Book'}
                                </div>
                                <div className="borrow-book-author">
                                  by {borrow.bookId?.author || 'Unknown Author'}
                                </div>
                              </div>
                            </td>
                            <td className="date-cell">
                              {formatDate(borrow.borrowDate)}
                            </td>
                            <td className="date-cell">
                              {formatDate(borrow.dueDate)}
                            </td>
                            <td>
                              {isOverdue ? (
                                <span className="status-badge status-overdue">
                                  Overdue
                                </span>
                              ) : (
                                <span className="status-badge status-active">
                                  Active
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Overdue Tab */}
          {activeTab === 'overdue' && (
            <div className="borrow-records">
              <h3 className="section-title">Overdue Books</h3>
              {overdueBorrows.length === 0 ? (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3 className="success-title">No Overdue Books</h3>
                  <p className="success-text">All borrowed books are returned on time!</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Borrower</th>
                        <th>Book</th>
                        <th>Due Date</th>
                        <th>Days Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueBorrows.map((borrow) => {
                        const daysOverdue = Math.ceil(
                          (new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <tr key={borrow._id}>
                            <td>
                              <div className="borrower-info">
                                <div className="borrower-name">
                                  {borrow.userId?.name || 'Unknown User'}
                                </div>
                                <div className="borrower-email">
                                  {borrow.userId?.email || 'No email'}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="book-info">
                                <div className="borrow-book-title">
                                  {borrow.bookId?.title || 'Unknown Book'}
                                </div>
                                <div className="borrow-book-author">
                                  by {borrow.bookId?.author || 'Unknown Author'}
                                </div>
                              </div>
                            </td>
                            <td className="date-cell">
                              {formatDate(borrow.dueDate)}
                            </td>
                            <td>
                              <span className="status-badge status-overdue">
                                {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
