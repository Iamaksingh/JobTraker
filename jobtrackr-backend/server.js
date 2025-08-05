// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Home route
app.get('/', (req, res) => {
  res.send('JobTrackr API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Routes
app.use('/api', authRoutes);
app.use('/api/jobs', jobRoutes);