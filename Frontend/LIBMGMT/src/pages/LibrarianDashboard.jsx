import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
        (await import('../lib/api')).apiFetch('/api/books'),
        (await import('../lib/api')).apiFetch('/api/borrow/all', {
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
  const recentReturns = borrowRecords
    .filter(record => record.returnDate)
    .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate))
    .slice(0, 5);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Librarian Dashboard</h1>
        <p className="text-gray-600">
          Monitor library operations and manage book collections
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link 
          to="/librarian/add-book"
          className="bg-library-primary text-white rounded-lg p-6 hover:bg-library-primary/90 transition-colors"
        >
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-lg font-semibold">Add New Book</h3>
          <p className="text-sm opacity-90">Add books to the collection</p>
        </Link>
        
        <Link 
          to="/librarian/books"
          className="bg-library-secondary text-white rounded-lg p-6 hover:bg-library-secondary/90 transition-colors"
        >
          <div className="text-3xl mb-2">📖</div>
          <h3 className="text-lg font-semibold">Manage Books</h3>
          <p className="text-sm opacity-90">Edit or remove books</p>
        </Link>
        
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-lg font-semibold text-gray-800">View Reports</h3>
          <p className="text-sm text-gray-600">Analytics and insights</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.totalBooks}</div>
          <div className="text-sm text-gray-600">Total Books</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-green-600">{stats.availableCopies}</div>
          <div className="text-sm text-gray-600">Available Copies</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.borrowedCopies}</div>
          <div className="text-sm text-gray-600">Borrowed Copies</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-2xl font-bold text-red-600">{stats.overdueBorrows}</div>
          <div className="text-sm text-gray-600">Overdue Books</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-library-primary text-library-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('active-borrows')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'active-borrows'
                  ? 'border-library-primary text-library-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Borrows ({stats.activeBorrows})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'overdue'
                  ? 'border-library-primary text-library-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overdue ({stats.overdueBorrows})
            </button>
            <button
              onClick={() => setActiveTab('recent-returns')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'recent-returns'
                  ? 'border-library-primary text-library-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recent Returns
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activeBorrows.slice(0, 5).map((borrow) => (
                      <div key={borrow._id} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium text-gray-800">
                          {borrow.userId?.name || 'Unknown User'} borrowed
                        </div>
                        <div className="text-sm text-gray-600">
                          "{borrow.bookId?.title || 'Unknown Book'}"
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(borrow.borrowDate)}
                        </div>
                      </div>
                    ))}
                    {activeBorrows.length === 0 && (
                      <p className="text-gray-500 text-sm">No recent borrowing activity</p>
                    )}
                  </div>
                </div>

                {/* Popular Books */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Borrowed Books</h3>
                  <div className="space-y-3">
                    {books
                      .filter(book => book.quantity - book.available > 0)
                      .sort((a, b) => (b.quantity - b.available) - (a.quantity - a.available))
                      .slice(0, 5)
                      .map((book) => (
                        <div key={book._id} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-800">{book.title}</div>
                          <div className="text-sm text-gray-600">by {book.author}</div>
                          <div className="text-xs text-gray-500">
                            {book.quantity - book.available} of {book.quantity} copies borrowed
                          </div>
                        </div>
                      ))}
                    {books.filter(book => book.quantity - book.available > 0).length === 0 && (
                      <p className="text-gray-500 text-sm">No books currently borrowed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Borrows Tab */}
          {activeTab === 'active-borrows' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Borrows</h3>
              {activeBorrows.length === 0 ? (
                <p className="text-gray-500">No active borrows</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">Borrower</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Book</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Borrow Date</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Due Date</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBorrows.map((borrow) => {
                        const isOverdue = new Date(borrow.dueDate) < new Date();
                        return (
                          <tr key={borrow._id} className="border-t hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium text-gray-800">
                                {borrow.userId?.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-600">
                                {borrow.userId?.email || 'No email'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-gray-800">
                                {borrow.bookId?.title || 'Unknown Book'}
                              </div>
                              <div className="text-sm text-gray-600">
                                by {borrow.bookId?.author || 'Unknown Author'}
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {formatDate(borrow.borrowDate)}
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {formatDate(borrow.dueDate)}
                            </td>
                            <td className="p-3">
                              {isOverdue ? (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                  Overdue
                                </span>
                              ) : (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
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
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Overdue Books</h3>
              {overdueBorrows.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Overdue Books</h3>
                  <p className="text-gray-600">All borrowed books are returned on time!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-red-700">Borrower</th>
                        <th className="text-left p-3 font-semibold text-red-700">Book</th>
                        <th className="text-left p-3 font-semibold text-red-700">Due Date</th>
                        <th className="text-left p-3 font-semibold text-red-700">Days Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueBorrows.map((borrow) => {
                        const daysOverdue = Math.ceil(
                          (new Date() - new Date(borrow.dueDate)) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <tr key={borrow._id} className="border-t hover:bg-red-50">
                            <td className="p-3">
                              <div className="font-medium text-gray-800">
                                {borrow.userId?.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-600">
                                {borrow.userId?.email || 'No email'}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-gray-800">
                                {borrow.bookId?.title || 'Unknown Book'}
                              </div>
                              <div className="text-sm text-gray-600">
                                by {borrow.bookId?.author || 'Unknown Author'}
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              {formatDate(borrow.dueDate)}
                            </td>
                            <td className="p-3">
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
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

          {/* Recent Returns Tab */}
          {activeTab === 'recent-returns' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Returns</h3>
              {recentReturns.length === 0 ? (
                <p className="text-gray-500">No recent returns</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">Borrower</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Book</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Borrowed</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Returned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReturns.map((borrow) => (
                        <tr key={borrow._id} className="border-t hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium text-gray-800">
                              {borrow.userId?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {borrow.userId?.email || 'No email'}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-gray-800">
                              {borrow.bookId?.title || 'Unknown Book'}
                            </div>
                            <div className="text-sm text-gray-600">
                              by {borrow.bookId?.author || 'Unknown Author'}
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {formatDate(borrow.borrowDate)}
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {formatDate(borrow.returnDate)}
                          </td>
                        </tr>
                      ))}
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
