const BloodRequest = require('../models/BloodRequest');

// POST /api/requests — hospital creates a blood request
const createRequest = async (req, res) => {
  try {
    const { bloodType, units, urgency, patientName, notes } = req.body;

    const request = await BloodRequest.create({
      hospitalId: req.user._id,
      bloodType,
      units,
      urgency: urgency || 'normal',
      patientName,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Blood request created',
      request,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/requests/my — hospital sees their own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ hospitalId: req.user._id })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/requests — admin sees all requests
const getAllRequests = async (req, res) => {
  try {
    const { status, urgency } = req.query;

    const filter = {};
    if (status)  filter.status  = status;
    if (urgency) filter.urgency = urgency;

    const requests = await BloodRequest.find(filter)
      .populate('hospitalId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/requests/:id/status — admin updates request status
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('hospitalId', 'name email');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
};