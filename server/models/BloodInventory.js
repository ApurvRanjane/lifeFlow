const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: true,
    },
    units: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true, // Blood bank / hospital name
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin who added this entry
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
