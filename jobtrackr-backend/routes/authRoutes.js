// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);


//for testing
import protect from '../middleware/authMiddleware.js';
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Private data',
    user: req.user,
  });
});

export default router;