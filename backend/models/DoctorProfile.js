const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  slots: {
    type: [String], // Array of time strings like ["09:00 AM", "10:00 AM", "02:00 PM"]
    default: [],
  }
});

const DoctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please add experience in years'],
      min: [0, 'Experience cannot be negative'],
      default: 0,
    },
    fees: {
      type: Number,
      required: [true, 'Please add consultation fees'],
      min: [0, 'Fees cannot be negative'],
      default: 0,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    qualifications: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    availability: {
      type: [AvailabilitySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DoctorProfile', DoctorProfileSchema);
