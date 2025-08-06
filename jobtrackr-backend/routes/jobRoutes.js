// routes/jobRoutes.js
import express from 'express';
import { addJobApplication, getAllJobs, getJobById, updateJob, deleteJob, getAnalytics} from '../controllers/jobController.js';
import protect from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/getUserProfile.js';

const router = express.Router();

// POST /api/jobs — Add a new job application
router.post('/', protect, addJobApplication);

// GET /api/jobs
router.get('/', protect, getAllJobs);
router.get('/profile', protect, getUserProfile);
router.get('/analytics', protect, getAnalytics);
router.get('/:id', protect, getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
export default router;