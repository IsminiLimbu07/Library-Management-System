import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-library-primary to-library-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to LibraryMS
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            A modern library management system that streamlines book borrowing, 
            inventory management, and provides an exceptional reading experience.
          </p>
          
          {user ? (
            <Link 
              to="/dashboard" 
              className="btn bg-library-accent text-library-primary hover:bg-library-accent/90 text-lg px-8 py-3"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn bg-library-accent text-library-primary hover:bg-library-accent/90 text-lg px-8 py-3"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="btn btn-secondary text-lg px-8 py-3"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Key Features
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover what makes LibraryMS the perfect solution for modern library management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Book Management
              </h3>
              <p className="text-gray-600">
                Efficiently manage your library's book collection with easy-to-use 
                tools for adding, editing, and organizing books.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Smart Search
              </h3>
              <p className="text-gray-600">
                Find books quickly with our advanced search functionality 
                that searches by title, author, category, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                User Management
              </h3>
              <p className="text-gray-600">
                Separate interfaces for borrowers and librarians with 
                role-based access control and personalized dashboards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Responsive Design
              </h3>
              <p className="text-gray-600">
                Access the system from any device with our mobile-first, 
                responsive design that works on phones, tablets, and desktops.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Borrow Tracking
              </h3>
              <p className="text-gray-600">
                Track borrowed books, due dates, and returns with automated 
                notifications and comprehensive reporting.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Built with security in mind using JWT authentication, 
                encrypted passwords, and secure API endpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose LibraryMS?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-library-primary mb-2">
                Easy to Use
              </div>
              <p className="text-gray-600">
                Intuitive interface designed for both librarians and borrowers
              </p>
            </div>

            <div className="p-6">
              <div className="text-3xl font-bold text-library-primary mb-2">
                Modern Tech
              </div>
              <p className="text-gray-600">
                Built with React, Node.js, and MongoDB for scalability
              </p>
            </div>

            <div className="p-6">
              <div className="text-3xl font-bold text-library-primary mb-2">
                Open Source
              </div>
              <p className="text-gray-600">
                Customizable and extensible to meet your library's needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-library-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of libraries using LibraryMS to streamline their operations
            </p>
            <Link 
              to="/register" 
              className="btn bg-library-accent text-library-primary hover:bg-library-accent/90 text-lg px-8 py-3"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
