import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        <div className="footer-content">
          
          {/* Left Column - Library Management */}
          <div className="footer-column">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="footer-icon">
                  <rect x="3" y="4" width="18" height="16" rx="2" fill="#D4A017"/>
                  <rect x="5" y="6" width="6" height="2" rx="1" fill="#2C4A7E"/>
                  <rect x="5" y="9" width="8" height="2" rx="1" fill="#8A94A6"/>
                  <rect x="5" y="12" width="10" height="2" rx="1" fill="#D4A017"/>
                  <circle cx="17" cy="8" r="2" fill="#2C4A7E"/>
                </svg>
                <h3 className="footer-brand-text">BookSphere</h3>
              </div>
              <p className="footer-tagline">
                Your digital gateway to knowledge and learning
              </p>
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column - Support */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li>
                <span className="footer-link">Email Support</span>
              </li>
              <li>
                <span className="footer-link">Phone: (025) 123-456</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Notice */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Library Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
