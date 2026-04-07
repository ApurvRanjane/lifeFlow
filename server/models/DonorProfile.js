const mongoose = require('mongoose');

const donorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',       // This links to the User model
      required: true,
      unique: true,
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    isEligible: {
      type: Boolean,
      default: true, // Becomes false after donation, true after 56 days
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DonorProfile', donorProfileSchema);