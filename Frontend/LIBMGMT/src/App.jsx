import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookDetailsPage from './pages/BookDetailsPage';
import ProfilePage from './pages/ProfilePage';
import LibrarianDashboard from './pages/LibrarianDashboard';
import AddBookPage from './pages/AddBookPage';
import ManageBooksPage from './pages/ManageBooksPage';
import EditBookPage from './pages/EditBookPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';

// Protected Route component
const ProtectedRoute = ({ children, requireLibrarian = false }) => {
  const { user, loading, isLibrarian } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireLibrarian && !isLibrarian) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Layout><LoginPage /></Layout>
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Layout><RegisterPage /></Layout>
          </PublicRoute>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/books/:id" 
        element={
          <ProtectedRoute>
            <Layout><BookDetailsPage /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        } 
      />

      {/* Librarian routes */}
      <Route 
        path="/librarian" 
        element={
          <ProtectedRoute requireLibrarian={true}>
            <Layout><LibrarianDashboard /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/librarian/books" 
        element={
          <ProtectedRoute requireLibrarian={true}>
            <Layout><ManageBooksPage /></Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/librarian/add-book" 
        element={
          <ProtectedRoute requireLibrarian={true}>
            <Layout><AddBookPage /></Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/librarian/books/:id/edit" 
        element={
          <ProtectedRoute requireLibrarian={true}>
            <Layout><EditBookPage /></Layout>
          </ProtectedRoute>
        } 
      />

      {/* 404 route */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
