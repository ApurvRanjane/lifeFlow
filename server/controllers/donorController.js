const DonorProfile = require('../models/DonorProfile');
const User = require('../models/User');

// GET /api/donors/profile — get logged in donor's profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await DonorProfile.findOne({ userId: req.user._id })
      .populate('userId', 'name email'); // join User data

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/donors/profile — update logged in donor's profile
const updateMyProfile = async (req, res) => {
  try {
    const { city, phone, dateOfBirth } = req.body;

    const profile = await DonorProfile.findOneAndUpdate(
      { userId: req.user._id },
      { city, phone, dateOfBirth },
      { new: true } // return updated document
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/donors/search?bloodType=B+&city=Nagpur
const searchDonors = async (req, res) => {
  try {
    const { bloodType, city } = req.query;

    // Build filter dynamically
    const filter = { isEligible: true };
    if (bloodType) filter.bloodType = bloodType;
    if (city) filter.city = new RegExp(city, 'i'); // case-insensitive search

    const donors = await DonorProfile.find(filter)
      .populate('userId', 'name email')
      .select('-lastDonationDate'); // hide sensitive info from search

    res.status(200).json({ success: true, count: donors.length, donors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/donors/all — admin only — get all donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await DonorProfile.find()
      .populate('userId', 'name email isApproved isActive')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: donors.length, donors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/donors/:id/approve — admin only — approve a donor
const approveDonor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Donor approved', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  searchDonors,
  getAllDonors,
  approveDonor,
};