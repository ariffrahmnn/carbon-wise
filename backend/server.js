import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import AuthController from './src/routes/auth.routes.js';
import emissionRoutes from './src/routes/emission.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import { autoSeedDefaultAdmin } from './src/utils/adminSeeder.js';
import { ensureSchema } from './src/utils/dbMigration.js';

dotenv.config();

const app = express();

// Middleware Global
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin tidak diizinkan oleh CORS')); // Tolak origin tidak dikenal
  },
  credentials: true
}));

// Security Headers & Device Permissions Policy (Membatasi hardware yang tidak digunakan)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    permissionsPolicy: {
      features: {
        camera: ["'none'"],
        microphone: ["'none'"],
        geolocation: ["'none'"],
        payment: ["'none'"],
        usb: ["'none'"],
        fullscreen: ["'self'"],
      },
    },
  })
);
app.use(express.json());

// Route Auth & Admin
app.use('/api/v1/auth', AuthController);
app.use('/api/v1/emissions', emissionRoutes);
app.use('/api/v1/admin', adminRoutes);

// Route Test Server
app.get('/', (req, res) => {
  res.send('Server CarbonWise API Berjalan Lancar! 🚀');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  await ensureSchema();
  await autoSeedDefaultAdmin();
});