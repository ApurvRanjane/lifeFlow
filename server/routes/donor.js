const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard      = require('../middleware/roleGuard');
const {
  getMyProfile,
  updateMyProfile,
  searchDonors,
  getAllDonors,
  approveDonor,
} = require('../controllers/donorController');

// Public — anyone can search donors by blood type + city
router.get('/search', searchDonors);

// Donor only routes
router.get('/profile', authMiddleware, roleGuard('donor'), getMyProfile);
router.put('/profile', authMiddleware, roleGuard('donor'), updateMyProfile);

// Admin only routes
router.get('/all',          authMiddleware, roleGuard('admin'), getAllDonors);
router.put('/:id/approve',  authMiddleware, roleGuard('admin'), approveDonor);

module.exports = router;