const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
require('dotenv').config(); // ← no path needed

const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@lifeflow.com' });
    if (existing) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await User.create({
      name: 'LifeFlow Admin',
      email: 'admin@lifeflow.com',
      password: hashedPassword,
      role: 'admin',
      isApproved: true,
    });

    console.log('Admin created successfully!');
    console.log('Email: admin@lifeflow.com');
    console.log('Password: Admin@123');
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();