const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── Helper: generate JWT token ──────────────────────────
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },           // payload — what gets stored inside the token
    process.env.JWT_SECRET,     // secret key from .env
    { expiresIn: '7d' }         // token expires in 7 days
  );
};

// ── REGISTER ─────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, bloodType, city, phone } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 2. Hash the password — NEVER store plain text password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'donor',   // default to donor if not specified
    });

    // 4. If role is donor, also create their DonorProfile
    if (user.role === 'donor') {
      await DonorProfile.create({
        userId: user._id,
        bloodType,
        city,
        phone,
      });
    }

    // 5. Generate token
    const token = generateToken(user._id, user.role);

    // 6. Send response — never send password back
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 2. Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // 3. Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'  // same message — don't hint which is wrong
      });
    }

    // 4. Generate token
    const token = generateToken(user._id, user.role);

    // 5. Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET LOGGED IN USER ────────────────────────────────────
// GET /api/auth/me  (protected route)
const getMe = async (req, res) => {
  try {
    // req.user is already set by authMiddleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe };