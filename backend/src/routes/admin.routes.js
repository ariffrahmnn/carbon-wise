import express from 'express';
import { getStudentRecords, getDistinctSchools, getStudentAnalytics } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Seluruh rute admin dilindungi oleh verifyAdmin middleware
router.get('/students', verifyAdmin, getStudentRecords);
router.get('/schools', verifyAdmin, getDistinctSchools);
router.get('/students/:id/analytics', verifyAdmin, getStudentAnalytics);

export default router;
