import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-library-secondary mb-4">About Our Library</h1>
            <p className="text-lg text-gray-600">
              Connecting readers with knowledge through modern technology
            </p>
          </div>

          {/* Our Mission Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We believe that access to knowledge should be simple, efficient, and enjoyable. Our digital library 
              management system brings the best features traditional library services and modern convenience together, 
              creating an experience that serves both librarians and patrons effectively.
            </p>
          </div>

          {/* What We Offer Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6">What We Offer</h2>
            
            <div className="space-y-6">
              {/* Smart Search */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Search🔎</h3>
                  <p className="text-gray-600">
                    Find exactly what you're looking for with our intelligent search. Query titles by title, 
                    author, ISBN, and category.
                  </p>
                </div>
              </div>

              {/* Quick Borrowing */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Borrowing🤝</h3>
                  <p className="text-gray-600">
                    Borrow and return books with just a few clicks. Track your reading history and manage 
                    due dates efficiently.
                  </p>
                </div>
              </div>

              {/* Mobile Accessible */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile Accessible📱</h3>
                  <p className="text-gray-600">
                    Access your library account from mobile devices. Our responsive design works perfectly on 
                    phones, tablets, and computers.
                  </p>
                </div>
              </div>

              {/* Role-Based Access */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Role-Based Access👥</h3>
                  <p className="text-gray-600">
                    Different access levels for Students and Librarians ensure security while providing the 
                    right tools for each user type.
                  </p>
                </div>
              </div>

              {/* Analytics & Reports */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics & Reports📊</h3>
                  <p className="text-gray-600">
                    Librarians can track book availability, borrowing patterns, and generate reports for 
                    better library management.
                  </p>
                </div>
              </div>

              {/* Secure & Reliable */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure & Reliable🔐</h3>
                  <p className="text-gray-600">
                    Built with state-of-the-art security standards and reliable backup systems, ensuring your 
                    data is always safe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Technology Stack⚙️</h2>
            <p className="text-gray-600 mb-6">
              Our system is built using modern web technologies to ensure performance, scalability, and maintainability.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Frontend */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Frontend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-library-accent rounded-full mr-3"></span>
                    React library for components
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-library-accent rounded-full mr-3"></span>
                    Context API for state management
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-library-accent rounded-full mr-3"></span>
                    Responsive CSS with Flexbox
                  </li>
                </ul>
              </div>

              {/* Backend */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Backend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-library-accent rounded-full mr-3"></span>
                    Node.js runtime environment
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-library-accent rounded-full mr-3"></span>
                    MongoDB with Mongoose
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-library-accent rounded-full mr-3"></span>
                    JWT for authentication
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-library-accent rounded-full mr-3"></span>
                    RESTful API architecture
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;