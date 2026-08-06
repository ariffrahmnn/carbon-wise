import React from 'react';
import { Navigate } from 'react-router-dom';

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

  if (!token || !user || user.role?.toUpperCase() !== 'ADMIN') {
    // Jika bukan admin atau tidak ada token, kembalikan ke login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
