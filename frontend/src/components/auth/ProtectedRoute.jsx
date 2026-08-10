import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, clearSession } from '../../utils/auth.js';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {}
  }

  if (!token || isTokenExpired(token)) {
    // Jika tidak ada token atau sesi > 24 jam, hapus sesi & tendang user ke Login
    clearSession();
    return <Navigate to="/login" replace />;
  }

  // Jika akun adalah ADMIN, kembalikan ke /admin
  if (user?.role?.toUpperCase() === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  // Jika pengguna biasa, izinkan mengakses halaman siswa
  return children;
};

export default ProtectedRoute;