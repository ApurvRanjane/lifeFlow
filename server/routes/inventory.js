const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard      = require('../middleware/roleGuard');
const {
  getInventory,
  getInventoryStats,
  addInventory,
  updateInventory,
  markExpired,
} = require('../controllers/inventoryController');

// Any logged in user can view inventory
router.get('/',      authMiddleware, getInventory);
router.get('/stats', authMiddleware, getInventoryStats);

// Admin only
router.post('/',            authMiddleware, roleGuard('admin'), addInventory);
router.put('/:id',          authMiddleware, roleGuard('admin'), updateInventory);
router.put('/:id/expire',   authMiddleware, roleGuard('admin'), markExpired);

module.exports = router;