import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiFetch } from '../lib/api';
const ManageBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  
  const { getAuthHeader } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { apiFetch } = await import('../lib/api');
      const response = await apiFetch('/api/books');
      const data = await response.json();
      
      if (response.ok) {
        setBooks(data.books || []);
      } else {
        setError('Failed to load books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(bookId);
    
    try {
      const response = await apiFetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (response.ok) {
        setBooks(books.filter(book => book._id !== bookId));
        alert('Book deleted successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Network error. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(books.map(book => book.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading books..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Books</h1>
            <p className="text-gray-600">
              Add, edit, or remove books from the library collection
            </p>
          </div>
          
          <Link 
            to="/librarian/add-book"
            className="btn btn-primary mt-4 md:mt-0"
          >
            📚 Add New Book
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Books
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or author..."
                className="input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                id="category"
                className="input w-full"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="bg-white rounded-lg shadow-md">
        {filteredBooks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Books Found</h3>
            <p className="text-gray-600 mb-4">
              {books.length === 0 
                ? "No books in the library yet. Add your first book!"
                : "No books match your search criteria."
              }
            </p>
            {books.length === 0 && (
              <Link 
                to="/librarian/add-book"
                className="btn btn-primary"
              >
                Add First Book
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Book Details</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Copies</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{book.title}</h3>
                        <p className="text-gray-600">by {book.author}</p>
                        <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                        {book.publishedYear && (
                          <p className="text-sm text-gray-500">Published: {book.publishedYear}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {book.category && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {book.category}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>Total: {book.quantity}</div>
                        <div className="text-green-600">Available: {book.available}</div>
                        <div className="text-orange-600">Borrowed: {book.quantity - book.available}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      {book.available > 0 ? (
                        <span className="text-green-600 font-medium">Available</span>
                      ) : (
                        <span className="text-red-600 font-medium">All Borrowed</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/librarian/edit-book/${book._id}`}
                          className="btn btn-secondary text-sm px-3 py-1"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book._id, book.title)}
                          disabled={deletingId === book._id}
                          className="btn btn-destructive text-sm px-3 py-1"
                        >
                          {deletingId === book._id ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                              ...
                            </div>
                          ) : (
                            '🗑️ Delete'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        Total Books: {books.length} | Showing: {filteredBooks.length}
      </div>
    </div>
  );
};

export default ManageBooksPage;
