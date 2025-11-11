import express from 'express';
import { getAllClasses } from '../controllers/classController.js';
import { requireAuth } from '../utils/authMiddleware.js'; // Assuming requireAuth middleware is needed for class access

const router = express.Router();

// Route to get all classes
router.get('/classes', requireAuth, getAllClasses);

export default router;
