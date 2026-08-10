import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, clearSession } from '../../utils/auth.js';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }

  if (!token || isTokenExpired(token) || !user || user.role?.toUpperCase() !== 'ADMIN') {
    // Jika bukan admin, sesi > 24 jam, atau tidak ada token, kembalikan ke login
    clearSession();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
