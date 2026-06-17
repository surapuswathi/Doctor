const express = require('express');
const {
  getDoctors,
  getDoctorById,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  updateProfile,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  validate,
  bookingValidationRules,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Apply protect middleware to all routes below
router.use(protect);

router.get('/doctors', authorize('patient'), getDoctors);
router.get('/doctors/:id', authorize('patient'), getDoctorById);
router.post('/appointments', authorize('patient'), bookingValidationRules, validate, bookAppointment);
router.get('/appointments', authorize('patient'), getAppointments);
router.put('/appointments/:id/cancel', authorize('patient'), cancelAppointment);
router.put('/profile', authorize('patient'), updateProfile);

module.exports = router;
