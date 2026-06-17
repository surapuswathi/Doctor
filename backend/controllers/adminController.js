const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res, next) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const pendingDoctors = await DoctorProfile.countDocuments({ status: 'pending' });
    const totalAppointments = await Appointment.countDocuments();
    
    // Status breakdowns
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const acceptedAppointments = await Appointment.countDocuments({ status: 'accepted' });
    const rejectedAppointments = await Appointment.countDocuments({ status: 'rejected' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        pendingDoctors,
        totalAppointments,
        statusBreakdown: {
          pending: pendingAppointments,
          accepted: acceptedAppointments,
          rejected: rejectedAppointments,
          cancelled: cancelledAppointments,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (patients and doctors)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort('-createdAt');
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctor profiles with details
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate('user', 'name email phone gender dob address')
      .sort('-createdAt');
    res.json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject doctor profile
// @route   PUT /api/admin/doctors/:id/status
// @access  Private (Admin only)
exports.updateDoctorStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // status: 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status type' });
    }

    const doctorProfile = await DoctorProfile.findById(req.params.id).populate('user', 'name');
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctorProfile.status = status;
    await doctorProfile.save();

    res.json({
      success: true,
      message: `Doctor ${doctorProfile.user.name} has been ${status}`,
      data: doctorProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user account (Patient or Doctor)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deleted' });
    }

    // Delete associated DoctorProfile if user is a doctor
    if (user.role === 'doctor') {
      await DoctorProfile.findOneAndDelete({ user: user._id });
    }

    // Delete associated appointments
    await Appointment.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });

    // Delete the core User
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `User ${user.name} and all associated records deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments in the system
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .sort('-date -createdAt');

    // Attach specialization info to each appointment
    const enrichedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const docProfile = await DoctorProfile.findOne({ user: appointment.doctor._id });
        const appObj = appointment.toObject();
        if (docProfile) {
          appObj.doctor.specialization = docProfile.specialization;
        }
        return appObj;
      })
    );

    res.json({
      success: true,
      count: enrichedAppointments.length,
      data: enrichedAppointments,
    });
  } catch (error) {
    next(error);
  }
};
