import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiFetch } from '../lib/api';
const EditBookPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    description: '',
    category: '',
    publishedYear: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const { apiFetch } = await import('../lib/api');
      const response = await apiFetch(`/api/books/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        const book = data.book;
        setFormData({
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          quantity: book.quantity?.toString() || '',
          description: book.description || '',
          category: book.category || '',
          publishedYear: book.publishedYear?.toString() || ''
        });
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.author.trim()) return 'Author is required';
    if (!formData.isbn.trim()) return 'ISBN is required';
    if (!formData.quantity || parseInt(formData.quantity) < 1) return 'Quantity must be at least 1';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await apiFetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Book updated successfully!');
        setTimeout(() => {
          navigate('/librarian/books');
        }, 2000);
      } else {
        setError(data.error || 'Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner text="Loading book details..." />
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-6 rounded-md text-center">
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Book Not Found</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => navigate('/librarian/books')}
              className="btn btn-primary"
            >
              Back to Manage Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Book</h1>
          <p className="text-gray-600">
            Update book information in the library collection
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="input w-full"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  required
                  className="input w-full"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN *
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  required
                  className="input w-full"
                  placeholder="978-0-000-00000-0"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  min="1"
                  className="input w-full"
                  placeholder="Number of copies"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Note: Changing quantity will adjust available copies accordingly
                </p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="input w-full"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Children">Children</option>
                  <option value="Reference">Reference</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Published Year
                </label>
                <input
                  type="number"
                  id="publishedYear"
                  name="publishedYear"
                  min="1000"
                  max={new Date().getFullYear()}
                  className="input w-full"
                  placeholder={new Date().getFullYear()}
                  value={formData.publishedYear}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="input w-full resize-none"
                placeholder="Brief description of the book..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary flex-1"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Updating Book...
                  </div>
                ) : (
                  'Update Book'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/librarian/books')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;
