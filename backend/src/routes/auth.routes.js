import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Endpoint: POST /api/v1/auth/register
router.post('/register', authLimiter, (req, res) => authController.register(req, res));

// Endpoint: POST /api/v1/auth/login
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));

// Endpoint Google OAuth 2.0
router.get('/google', (req, res) => authController.googleRedirect(req, res));
router.get('/google/callback', (req, res) => authController.googleCallback(req, res));

export default router;