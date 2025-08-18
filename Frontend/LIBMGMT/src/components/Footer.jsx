import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-library-secondary text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📚 LibraryMS</h3>
            <p className="text-gray-300 text-sm">
              A modern library management system that helps libraries 
              efficiently manage their book collections and borrowing processes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-library-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-library-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-library-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>📧 support@libraryms.com</p>
              <p>📞 (555) 123-4567</p>
              <p>📍 123 Library Street, Book City, BC 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; 2024 LibraryMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
