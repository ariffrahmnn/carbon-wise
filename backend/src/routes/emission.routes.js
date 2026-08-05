import express from 'express';
import { getMasterItems, calculateEmission } from '../controllers/emission.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; // 👈 Import di sini

const router = express.Router();

router.get('/master-items', verifyToken, getMasterItems);
router.post('/calculate', verifyToken, calculateEmission);

export default router;