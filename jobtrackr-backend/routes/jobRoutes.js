// routes/jobRoutes.js
import express from 'express';
import { addJobApplication, getAllJobs, getJobById, updateJob, deleteJob, getAnalytics} from '../controllers/jobController.js';
import protect from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/getUserProfile.js';

const router = express.Router();

// ❗ Static routes come first
router.get('/profile', protect, getUserProfile);
router.get('/analytics', protect, getAnalytics);

// Dynamic routes come later
router.get('/:id', protect, getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

// Other routes
router.get('/', protect, getAllJobs);
router.post('/', protect, addJobApplication);

export default router;