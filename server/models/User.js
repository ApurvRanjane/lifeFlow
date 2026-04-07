const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['donor', 'hospital', 'admin'],
      default: 'donor',
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin must approve before user can fully access
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('User', userSchema);