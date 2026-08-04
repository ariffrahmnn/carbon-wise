import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

// Endpoint: POST /api/v1/auth/register
router.post('/register', (req, res) => authController.register(req, res));

// Endpoint: POST /api/v1/auth/login
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));

export default router;