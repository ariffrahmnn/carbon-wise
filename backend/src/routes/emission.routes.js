import express from 'express';
import { getMasterItems, calculateEmission, getAnalytics, resetEmissions } from '../controllers/emission.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; // 👈 Import di sini

const router = express.Router();

router.get('/master-items', verifyToken, getMasterItems);
router.post('/calculate', verifyToken, calculateEmission);
router.get('/analytics', verifyToken, getAnalytics);
router.delete('/reset', verifyToken, resetEmissions);

export default router;