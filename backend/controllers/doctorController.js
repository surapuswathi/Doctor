const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');

// @desc    Get current doctor's profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor only)
exports.getProfile = async (req, res, next) => {
  try {
    const docProfile = await DoctorProfile.findOne({ user: req.user.id }).populate(
      'user',
      'name email phone gender dob address'
    );

    if (!docProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({
      success: true,
      data: docProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile details (base user and doctor profile)
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, gender, dob, address, specialization, experience, fees, bio, qualifications } = req.body;

    // Update User credentials first
    const userFields = {};
    if (name) userFields.name = name;
    if (phone !== undefined) userFields.phone = phone;
    if (gender !== undefined) userFields.gender = gender;
    if (dob !== undefined) userFields.dob = dob;
    if (address !== undefined) userFields.address = address;

    await User.findByIdAndUpdate(req.user.id, userFields, { new: true, runValidators: true });

    // Update Doctor Profile details
    const profileFields = {};
    if (specialization) profileFields.specialization = specialization;
    if (experience !== undefined) profileFields.experience = experience;
    if (fees !== undefined) profileFields.fees = fees;
    if (bio !== undefined) profileFields.bio = bio;
    if (qualifications !== undefined) profileFields.qualifications = qualifications;

    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone gender dob address');

    res.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set weekly doctor availability
// @route   PUT /api/doctors/availability
// @access  Private (Doctor only)
exports.setAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body; // Array of { day: 'Monday', slots: ['09:00 AM', '10:00 AM'] }

    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'Availability must be an array of schedule slots' });
    }

    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { availability } },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone gender dob address');

    res.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctors/appointments
// @access  Private (Doctor only)
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email phone gender dob address')
      .sort('-date -createdAt');

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept/Reject appointment request
// @route   PUT /api/doctors/appointments/:id
// @access  Private (Doctor only)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, doctorNotes } = req.body; // status: accepted or rejected

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Status must be accepted or rejected' });
    }

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to modify this appointment' });
    }

    appointment.status = status;
    if (doctorNotes !== undefined) {
      appointment.doctorNotes = doctorNotes;
    }

    await appointment.save();

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};
