// controllers/jobController.js
import mongoose from 'mongoose';
import JobApplication from '../models/JobApplication.js';

export const addJobApplication = async (req, res) => {
  try {
    const { companyName, role, status, source, jdLink } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ message: 'Company and role are required' });
    }

    const job = new JobApplication({
      user: req.user._id, // from auth middleware
      companyName,
      role,
      status,
      source,
      jdLink,
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving job application' });
  }
};

//get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching job applications' });
  }
};


//Get a single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching job' });
  }
};

//Update a job application
export const updateJob = async (req, res) => {
  try {
    const job = await JobApplication.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const { companyName, role, status, source, jdLink } = req.body;

    job.companyName = companyName || job.companyName;
    job.role = role || job.role;
    job.status = status || job.status;
    job.source = source || job.source;
    job.jdLink = jdLink || job.jdLink;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating job' });
  }
};

//Delete a job application
export const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or already deleted' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting job' });
  }
};

//fetch analytics 
export const getAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); // cast to ObjectId

    const total = await JobApplication.countDocuments({ user: userId });

    const statusCounts = await JobApplication.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formatted = {};
    statusCounts.forEach(s => {
      formatted[s._id] = s.count;
    });

    res.json({ total, breakdown: formatted });
  } catch (error) {
    console.error('Analytics Error:', error); // helpful for logs
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};