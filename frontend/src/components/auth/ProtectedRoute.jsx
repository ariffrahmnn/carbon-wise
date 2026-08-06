import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Jika tidak ada token, tendang user kembali ke halaman Login
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, izinkan user mengakses komponen/halaman di dalamnya
  return children;
};

export default ProtectedRoute;