const express = require('express');
const {
  getProfile,
  updateProfile,
  setAvailability,
  getAppointments,
  updateAppointmentStatus,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/profile', authorize('doctor'), getProfile);
router.put('/profile', authorize('doctor'), updateProfile);
router.put('/availability', authorize('doctor'), setAvailability);
router.get('/appointments', authorize('doctor'), getAppointments);
router.put('/appointments/:id', authorize('doctor'), updateAppointmentStatus);

module.exports = router;
