const BloodInventory = require('../models/BloodInventory');

// GET /api/inventory — get all inventory (filter by bloodType if needed)
const getInventory = async (req, res) => {
  try {
    const { bloodType } = req.query;

    const filter = { isExpired: false };
    if (bloodType) filter.bloodType = bloodType;

    const inventory = await BloodInventory.find(filter)
      .populate('addedBy', 'name')
      .sort({ expiryDate: 1 }); // show soonest to expire first

    res.status(200).json({ success: true, count: inventory.length, inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/inventory/stats — total units per blood type
const getInventoryStats = async (req, res) => {
  try {
    const stats = await BloodInventory.aggregate([
      { $match: { isExpired: false } }, // only non-expired
      {
        $group: {
          _id: '$bloodType',            // group by blood type
          totalUnits: { $sum: '$units' } // sum all units
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/inventory — admin adds new blood units
const addInventory = async (req, res) => {
  try {
    const { bloodType, units, expiryDate, location } = req.body;

    const inventory = await BloodInventory.create({
      bloodType,
      units,
      expiryDate,
      location,
      addedBy: req.user._id, // admin who added it
    });

    res.status(201).json({
      success: true,
      message: 'Blood units added to inventory',
      inventory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/inventory/:id — admin updates units
const updateInventory = async (req, res) => {
  try {
    const { units, expiryDate, location } = req.body;

    const inventory = await BloodInventory.findByIdAndUpdate(
      req.params.id,
      { units, expiryDate, location },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.status(200).json({ success: true, message: 'Inventory updated', inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/inventory/:id/expire — admin marks units as expired
const markExpired = async (req, res) => {
  try {
    const inventory = await BloodInventory.findByIdAndUpdate(
      req.params.id,
      { isExpired: true, units: 0 },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.status(200).json({ success: true, message: 'Marked as expired', inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInventory,
  getInventoryStats,
  addInventory,
  updateInventory,
  markExpired,
};