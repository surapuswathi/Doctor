const express = require('express');
const {
  getStats,
  getUsers,
  getDoctors,
  updateDoctorStatus,
  deleteUser,
  getAppointments,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/doctors', getDoctors);
router.put('/doctors/:id/status', updateDoctorStatus);
router.get('/appointments', getAppointments);

module.exports = router;
