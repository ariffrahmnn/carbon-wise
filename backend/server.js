import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthController from './src/routes/auth.routes.js';
import emissionRoutes from './src/routes/emission.routes.js';

dotenv.config();

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());

// Route Auth (Public)
app.use('/api/v1/auth', AuthController);
app.use('/api/v1/emissions', emissionRoutes);

// Route Test Server
app.get('/', (req, res) => {
  res.send('Server CarbonWise API Berjalan Lancar! 🚀');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});