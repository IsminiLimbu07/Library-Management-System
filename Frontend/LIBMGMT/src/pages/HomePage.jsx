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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-line homepage-title">
            Welcome to LibraryMS
          </h1>
          <p className="text-lg  md:text-xl text-line mb-8 max-w-2xl mx-auto text-white">
            A modern library management system that streamlines book borrowing, 
            inventory management, and provides an exceptional reading experience.
          </p>
          
          {user ? (
            <Link 
              to="/librarian" 
              className="btn bg-library-accent text-library-primary hover:bg-library-accent/90 text-lg px-8 py-3"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-row sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn bg-library-warning text-library-primary  hover:bg-library-warning/90 text-lg px-8 py-3 "
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

      {/* Why Choose Our Library System Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Our Library System?
            </h2>
            <div className="w-16 h-1 bg-accent mx-auto"></div>
          </div>

          {/* 2x3 Grid Layout */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1: Vast Collection */}
              <div className="feature-card">
                <div className="feature-icon vast-collection">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M4 19.5C4 18.837 4.268 18.201 4.744 17.732C5.22 17.262 5.867 17 6.542 17H20V4H6.542C5.867 4 5.22 4.262 4.744 4.732C4.268 5.201 4 5.837 4 6.5V19.5Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 17H20V20.5C20 21.163 19.732 21.799 19.256 22.268C18.78 22.738 18.133 23 17.458 23H6.542C5.867 23 5.22 22.738 4.744 22.268C4.268 21.799 4 21.163 4 20.5V19.5C4 18.837 4.268 18.201 4.744 17.732C5.22 17.262 5.867 17 6.542 17Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="feature-title">Vast Collection</h3>
                <p className="feature-description">
                  Access thousands of books across various categories and genres
                </p>
              </div>

              {/* Card 2: Smart Search */}
              <div className="feature-card">
                <div className="feature-icon smart-search">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12L11 15L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="feature-title">Smart Search</h3>
                <p className="feature-description">
                  Find books quickly with our intelligent search and filtering system
                </p>
              </div>

              {/* Card 3: Mobile Friendly */}
              <div className="feature-card">
                <div className="feature-icon mobile-friendly">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="feature-title">Mobile Friendly</h3>
                <p className="feature-description">
                  Access your library anywhere with our responsive design
                </p>
              </div>

              {/* Card 4: Quick Borrowing */}
              <div className="feature-card">
                <div className="feature-icon quick-borrowing">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="feature-title">Quick Borrowing</h3>
                <p className="feature-description">
                  Borrow and return books with just a few clicks
                </p>
              </div>

              {/* Card 5: User Management */}
              <div className="feature-card">
                <div className="feature-icon user-management">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C23 18.1645 22.7155 17.3573 22.2094 16.7214C21.7033 16.0855 20.9983 15.6617 20.2 15.5279" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 18.9018 6.11683 18.7967 6.96975C18.6917 7.82266 18.2986 8.61205 17.6907 9.20654C17.0828 9.80103 16.2991 10.1649 15.47 10.2441" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="feature-title">User Management</h3>
                <p className="feature-description">
                  Separate access levels for borrowers and librarians
                </p>
              </div>

              {/* Card 6: Analytics */}
              <div className="feature-card">
                <div className="feature-icon analytics">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="7" y="13" width="3" height="6" fill="currentColor" opacity="0.3"/>
                    <rect x="12" y="9" width="3" height="10" fill="currentColor" opacity="0.3"/>
                    <rect x="17" y="11" width="3" height="8" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
                <h3 className="feature-title">Analytics</h3>
                <p className="feature-description">
                  Track borrowing history and manage book availability
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16  bg-background">
        <div className="container mx-auto px-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                Easy to Use
              </div>
              <p className="text-secondary">
                Intuitive interface designed for both librarians and borrowers
              </p>
            </div>

            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                Modern Tech
              </div>
              <p className="text-secondary">
                Built with React, Node.js, and MongoDB for scalability
              </p>
            </div>

            <div className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">
                Open Source
              </div>
              <p className="text-secondary">
                Customizable and extensible to meet your library's needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto my px-4 text-center">
            <h2 className="text-3xl text-white md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              Join thousands of libraries using LibraryMS to streamline their operations
            </p>
            <Link 
              to="/register" 
              className="btn bg-accent text-primary hover:bg-accent-hover text-lg px-8 py-3"
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
