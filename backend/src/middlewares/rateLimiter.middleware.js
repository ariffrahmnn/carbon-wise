import rateLimit from 'express-rate-limit';

// Rate Limiter khusus untuk Login & Register (Pencegahan Brute Force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 percobaan per 15 menit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login/register dari IP Anda. Silakan coba lagi setelah 15 menit.'
  }
});

// Rate Limiter untuk API umum
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200, // Maksimal 200 request per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan ke server. Silakan coba beberapa saat lagi.'
  }
});
