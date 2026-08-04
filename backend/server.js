import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthController from './src/routes/auth.routes.js';

dotenv.config();

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json()); // Supaya req.body JSON bisa dibaca

// Route Auth (Public)
app.use('/api/v1/auth', AuthController);

// Route Test Server
app.get('/', (req, res) => {
  res.send('Server CarbonWise API Berjalan Lancar! 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});