// routes/jobRoutes.js

import express from 'express';
import { addJobApplication, getAllJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/jobs — Add a new job application
router.post('/', protect, addJobApplication);

// GET /api/jobs
router.get('/', protect, getAllJobs);
export default router;

router.get('/:id', protect, getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);