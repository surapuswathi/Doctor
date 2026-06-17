const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');

// @desc    Get all approved doctors with optional search/filter
// @route   GET /api/patients/doctors
// @access  Private
exports.getDoctors = async (req, res, next) => {
  try {
    const { search, specialization } = req.query;
    let query = { status: 'approved' };

    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    let profiles = await DoctorProfile.find(query).populate({
      path: 'user',
      select: 'name email phone gender address',
    });

    // If search term is provided, filter by doctor name or specialization in-memory
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      profiles = profiles.filter((p) => {
        return (
          (p.user && p.user.name.match(searchRegex)) ||
          p.specialization.match(searchRegex)
        );
      });
    }

    res.json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor profile by User ID
// @route   GET /api/patients/doctors/:id
// @access  Private
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({
      user: req.params.id,
      status: 'approved',
    }).populate('user', 'name email phone gender address');

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Approved doctor profile not found' });
    }

    res.json({
      success: true,
      data: doctorProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book an appointment with a doctor
// @route   POST /api/patients/appointments
// @access  Private (Patient only)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;

    // Check if doctor profile exists and is approved
    const doctorProfile = await DoctorProfile.findOne({ user: doctorId, status: 'approved' });
    if (!doctorProfile) {
      return res.status(400).json({ message: 'Selected doctor is not approved or active' });
    }

    // Parse date to normalize (remove time component if needed)
    const appointmentDate = new Date(date);
    appointmentDate.setUTCHours(0, 0, 0, 0);

    // Check if slot is already booked for this doctor on this day
    const slotBooked = await Appointment.findOne({
      doctor: doctorId,
      date: appointmentDate,
      timeSlot,
      status: { $in: ['pending', 'accepted'] },
    });

    if (slotBooked) {
      return res.status(400).json({ message: 'This time slot is already booked. Please choose another slot.' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date: appointmentDate,
      timeSlot,
      symptoms,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient appointment history
// @route   GET /api/patients/appointments
// @access  Private (Patient only)
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name email phone')
      .sort('-date -createdAt');

    // Attach specialization info to each appointment doctor
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
      data: enrichedAppointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/patients/appointments/:id/cancel
// @access  Private (Patient only)
exports.cancelAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Make sure user owns appointment
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to modify this appointment' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private (Patient only)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, gender, dob, address } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (gender !== undefined) fieldsToUpdate.gender = gender;
    if (dob !== undefined) fieldsToUpdate.dob = dob;
    if (address !== undefined) fieldsToUpdate.address = address;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
