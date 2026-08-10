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