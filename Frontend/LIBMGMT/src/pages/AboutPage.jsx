import React from 'react';
import { apiFetch } from '../lib/api';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About LibraryMS</h1>
          <p className="text-lg text-gray-600">
            A modern, efficient library management system built with cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              LibraryMS is designed to revolutionize how libraries manage their collections 
              and serve their patrons. We believe that technology should make library 
              operations simpler, more efficient, and more accessible to everyone.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To create a world where every library, regardless of size or budget, 
              has access to powerful, user-friendly tools that enhance the reading 
              experience and streamline administrative tasks.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600 text-sm">JWT-based secure login with role-based access control</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold mb-2">Responsive Design</h3>
              <p className="text-gray-600 text-sm">Works seamlessly on desktop, tablet, and mobile devices</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Fast Performance</h3>
              <p className="text-gray-600 text-sm">Built with React and Node.js for optimal speed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold mb-2">Advanced Search</h3>
              <p className="text-gray-600 text-sm">Find books quickly with powerful search capabilities</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold">Frontend</h3>
              <p className="text-sm text-gray-600">React + JavaScript</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold">Backend</h3>
              <p className="text-sm text-gray-600">Node.js + Express</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold">Database</h3>
              <p className="text-sm text-gray-600">MongoDB</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold">Styling</h3>
              <p className="text-sm text-gray-600">CSS + Flexbox</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
