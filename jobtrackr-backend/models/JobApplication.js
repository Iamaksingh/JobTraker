// models/JobApplication.js

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  companyName: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
    default: 'Applied',
  },

  source: {
    type: String,
    enum: ['LinkedIn', 'Referral', 'Website', 'Other'],
    default: 'Other',
  },

  jdLink: {
    type: String,
    required: false,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const JobApplication = mongoose.model('JobApplication', jobSchema);

export default JobApplication;
