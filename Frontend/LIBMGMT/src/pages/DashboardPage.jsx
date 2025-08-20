import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiFetch } from '../lib/api';
const DashboardPage = () => {
  const { user, getAuthHeader, isLibrarian } = useAuth();
  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch available books
      const { apiFetch } = await import('../lib/api');
      const booksResponse = await apiFetch('/api/books');
      const booksData = await booksResponse.json();
      
      if (booksResponse.ok) {
        setBooks(booksData.books || []);
      }

      // Fetch user's borrowed books
      if (!isLibrarian) {
        const borrowsResponse = await apiFetch('/api/borrow/my-books?status=borrowed', {
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
      const response = await apiFetch('/api/borrow', {
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
      const response = await apiFetch('/api/borrow/return', {
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

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {isLibrarian 
            ? 'Manage your library efficiently with the tools below.'
            : 'Discover and borrow books from our collection.'
          }
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Librarian Quick Actions */}
      {isLibrarian && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/librarian/add-book"
              className="btn btn-primary text-center"
            >
              📚 Add New Book
            </Link>
            <Link 
              to="/librarian/books"
              className="btn btn-secondary text-center"
            >
              📖 Manage Books
            </Link>
            <Link 
              to="/librarian"
              className="btn btn-secondary text-center"
            >
              📊 View Reports
            </Link>
          </div>
        </div>
      )}

      {/* My Borrowed Books (for borrowers) */}
      {!isLibrarian && myBorrows.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">My Borrowed Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myBorrows.map((borrow) => (
              <div key={borrow._id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{borrow.bookId?.title}</h3>
                <p className="text-gray-600">by {borrow.bookId?.author}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Due: {new Date(borrow.dueDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleReturnBook(borrow._id)}
                  className="btn btn-secondary mt-3 w-full text-sm"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Books */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">Available Books</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              className="input w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No books found matching your search.' : 'No books available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div key={book._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-1">by {book.author}</p>
                <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                
                {book.description && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {book.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    Available: {book.available}/{book.quantity}
                  </span>
                  {book.category && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {book.category}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/books/${book._id}`}
                    className="btn btn-secondary flex-1 text-center text-sm"
                  >
                    View Details
                  </Link>
                  {!isLibrarian && book.available > 0 && (
                    <button
                      onClick={() => handleBorrowBook(book._id)}
                      className="btn btn-primary text-sm"
                    >
                      Borrow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
