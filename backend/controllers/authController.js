const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user (Patient or Doctor)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, gender, dob, address, specialization, experience, fees, bio, qualifications } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user base record
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      phone,
      gender,
      dob,
      address,
    });

    // If role is doctor, create their doctor profile
    if (user.role === 'doctor') {
      await DoctorProfile.create({
        user: user._id,
        specialization: specialization || 'General Practitioner',
        experience: experience || 0,
        fees: fees || 0,
        bio: bio || '',
        qualifications: qualifications || '',
        status: 'pending', // Requires admin approval
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if doctor profile status is rejected or pending?
    // Wait, doctors can log in but they won't show up in listings or be able to take bookings until approved.
    // However, it's nice to let them access their dashboard to update profiles.

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profileData = null;
    if (user.role === 'doctor') {
      profileData = await DoctorProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user,
      doctorProfile: profileData,
    });
  } catch (error) {
    next(error);
  }
};
