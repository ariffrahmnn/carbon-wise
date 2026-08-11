import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak! Token tidak ditemukan.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Sesi Anda telah kedaluwarsa (lebih dari 24 jam). Silakan login kembali!',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sesi telah berakhir!',
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'admin' || req.user.role?.toUpperCase() === 'ADMIN')) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak! Fitur ini khusus untuk Administrator.',
      });
    }
  });
};

// Middleware Proteksi IDOR: Memastikan parameter ID milik user itu sendiri atau diakses oleh ADMIN
export const verifyUserOrAdminAccess = (req, res, next) => {
  verifyToken(req, res, () => {
    const requestedId = req.params.id;
    const currentUser = req.user;

    // 1. Validasi format UUID untuk mencegah manipulasi ID atau error database
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (requestedId && !uuidRegex.test(requestedId)) {
      return res.status(400).json({
        success: false,
        message: 'Format ID pengguna tidak valid!',
      });
    }

    const isAdmin = currentUser && currentUser.role?.toUpperCase() === 'ADMIN';
    const isSelf = currentUser && currentUser.id === requestedId;

    if (isAdmin || isSelf) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak! Anda tidak memiliki izin mengakses data pengguna lain.',
      });
    }
  });
};