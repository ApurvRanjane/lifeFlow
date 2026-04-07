const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonorProfile',
      required: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    units: {
      type: Number,
      default: 1,
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    campId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camp',
      default: null, // null means walk-in donation, not from a camp
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin who recorded this donation
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);