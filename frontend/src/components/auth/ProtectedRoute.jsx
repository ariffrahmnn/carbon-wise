import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {}
  }

  if (!token) {
    // Jika tidak ada token, tendang user kembali ke halaman Login
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