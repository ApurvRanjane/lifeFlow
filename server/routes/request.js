const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard      = require('../middleware/roleGuard');
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} = require('../controllers/requestController');

// Hospital routes
router.post('/',     authMiddleware, roleGuard('hospital'), createRequest);
router.get('/my',    authMiddleware, roleGuard('hospital'), getMyRequests);

// Admin routes
router.get('/',              authMiddleware, roleGuard('admin'), getAllRequests);
router.put('/:id/status',    authMiddleware, roleGuard('admin'), updateRequestStatus);

module.exports = router;