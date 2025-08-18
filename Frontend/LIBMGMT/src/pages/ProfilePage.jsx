import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const { user, updateProfile, getAuthHeader, isLibrarian } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
    
    if (!isLibrarian) {
      fetchBorrowHistory();
    } else {
      setLoadingHistory(false);
    }
  }, [user, isLibrarian]);

  const fetchBorrowHistory = async () => {
    try {
      setLoadingHistory(true);
      const { apiFetch } = await import('../lib/api');
      const response = await apiFetch('/api/borrow/my-books', {
        headers: getAuthHeader()
      });
      const data = await response.json();
      
      if (response.ok) {
        setBorrowHistory(data.borrows || []);
      }
    } catch (error) {
      console.error('Error fetching borrow history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
    } else {
      setError(result.error || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeBorrows = borrowHistory.filter(borrow => !borrow.returnDate);
  const returnedBooks = borrowHistory.filter(borrow => borrow.returnDate);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account information and view your library activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Information</h2>

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input w-full"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input w-full"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md">
                  <span className="capitalize font-medium text-gray-800">
                    {user?.role || 'Not specified'}
                  </span>
                  {user?.role === 'librarian' && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Staff
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Updating Profile...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>

          {/* Library Activity (for borrowers) */}
          {!isLibrarian && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Library Activity</h2>

              {loadingHistory ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-library-primary border-t-transparent mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading activity...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Currently Borrowed Books */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">
                      Currently Borrowed ({activeBorrows.length})
                    </h3>
                    {activeBorrows.length === 0 ? (
                      <p className="text-gray-500 text-sm">No books currently borrowed</p>
                    ) : (
                      <div className="space-y-2">
                        {activeBorrows.map((borrow) => (
                          <div key={borrow._id} className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="font-medium text-gray-800">
                              {borrow.bookId?.title || 'Unknown Book'}
                            </div>
                            <div className="text-sm text-gray-600">
                              by {borrow.bookId?.author || 'Unknown Author'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Due: {formatDate(borrow.dueDate)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reading History */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">
                      Reading History ({returnedBooks.length})
                    </h3>
                    {returnedBooks.length === 0 ? (
                      <p className="text-gray-500 text-sm">No books returned yet</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {returnedBooks.map((borrow) => (
                          <div key={borrow._id} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                            <div className="font-medium text-gray-800">
                              {borrow.bookId?.title || 'Unknown Book'}
                            </div>
                            <div className="text-sm text-gray-600">
                              by {borrow.bookId?.author || 'Unknown Author'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Borrowed: {formatDate(borrow.borrowDate)} • 
                              Returned: {formatDate(borrow.returnDate)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-3">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-library-primary">
                          {borrowHistory.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Books Borrowed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {returnedBooks.length}
                        </div>
                        <div className="text-sm text-gray-600">Books Returned</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Librarian Info */}
          {isLibrarian && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Librarian Tools</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <a href="/librarian/add-book" className="block text-blue-600 hover:text-blue-800 text-sm">
                      📚 Add New Book
                    </a>
                    <a href="/librarian/books" className="block text-blue-600 hover:text-blue-800 text-sm">
                      📖 Manage Books
                    </a>
                    <a href="/librarian" className="block text-blue-600 hover:text-blue-800 text-sm">
                      📊 View Reports
                    </a>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="font-medium text-green-800 mb-2">Access Level</h3>
                  <p className="text-green-700 text-sm">
                    You have full access to library management features including adding, editing, 
                    and removing books from the collection.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
