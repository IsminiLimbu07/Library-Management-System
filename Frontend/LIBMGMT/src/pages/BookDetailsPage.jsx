import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BookDetailsPage = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userBorrows, setUserBorrows] = useState([]);
  
  const { user, getAuthHeader, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchBookDetails();
    if (user && !isLibrarian) {
      fetchUserBorrows();
    }
  }, [id, user]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const { apiFetch } = await import('../lib/api');
      const response = await apiFetch(`/api/books/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setBook(data.book);
      } else {
        setError(data.error || 'Book not found');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBorrows = async () => {
    try {
      const { apiFetch } = await import('../lib/api');
      const response = await apiFetch('/api/borrow/my-books', {
        headers: getAuthHeader()
      });
      const data = await response.json();
      
      if (response.ok) {
        setUserBorrows(data.borrows || []);
      }
    } catch (error) {
      console.error('Error fetching user borrows:', error);
    }
  };

  const handleBorrowBook = async () => {
    setBorrowing(true);
    setError('');
    setSuccess('');

    try {
      const { apiFetch } = await import('../lib/api');
      const response = await apiFetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ bookId: id })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Book borrowed successfully! Check your dashboard to view borrowed books.');
        // Refresh book details to update available count
        fetchBookDetails();
        // Refresh user borrows
        fetchUserBorrows();
      } else {
        setError(data.error || 'Failed to borrow book');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      setError('Network error. Please try again.');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading book details..." />
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-6 rounded-md text-center">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-xl font-semibold mb-2">Book Not Found</h2>
            <p className="mb-4">{error}</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAlreadyBorrowed = userBorrows.some(borrow => 
    borrow.bookId?._id === id && !borrow.returnDate
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            to="/dashboard"
            className="text-library-primary hover:text-library-primary/80 flex items-center"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            {/* Book Cover Placeholder */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-library-primary to-library-secondary rounded-lg p-8 text-white text-center aspect-[3/4] flex flex-col justify-center">
                <div className="text-6xl mb-4">📖</div>
                <div className="text-sm opacity-80">Book Cover</div>
              </div>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600">by {book.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">ISBN:</span>
                    <span className="ml-2 text-gray-600">{book.isbn}</span>
                  </div>
                  {book.publishedYear && (
                    <div>
                      <span className="font-medium text-gray-700">Published:</span>
                      <span className="ml-2 text-gray-600">{book.publishedYear}</span>
                    </div>
                  )}
                  {book.category && (
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {book.category}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {book.description && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{book.description}</p>
                  </div>
                )}

                {/* Availability Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Availability</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{book.quantity}</div>
                      <div className="text-sm text-gray-600">Total Copies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{book.available}</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{book.quantity - book.available}</div>
                      <div className="text-sm text-gray-600">Borrowed</div>
                    </div>
                  </div>
                </div>

                {/* Borrow Button (for borrowers only) */}
                {user && !isLibrarian && (
                  <div className="pt-4">
                    {isAlreadyBorrowed ? (
                      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">📖</span>
                          <div>
                            <div className="font-medium">You have already borrowed this book</div>
                            <div className="text-sm">Check your dashboard to manage your borrowed books</div>
                          </div>
                        </div>
                      </div>
                    ) : book.available > 0 ? (
                      <button
                        onClick={handleBorrowBook}
                        disabled={borrowing}
                        className="btn btn-primary w-full lg:w-auto"
                      >
                        {borrowing ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Borrowing Book...
                          </div>
                        ) : (
                          '📚 Borrow This Book'
                        )}
                      </button>
                    ) : (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">❌</span>
                          <div>
                            <div className="font-medium">No copies available</div>
                            <div className="text-sm">All copies are currently borrowed. Please check back later.</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit button for librarians */}
                {isLibrarian && (
                  <div className="pt-4">
                    <Link
                      to={`/librarian/edit-book/${book._id}`}
                      className="btn btn-secondary"
                    >
                      ✏️ Edit Book Details
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Actions */}
        <div className="mt-8 text-center">
          <Link 
            to="/dashboard"
            className="btn btn-secondary"
          >
            Browse More Books
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
