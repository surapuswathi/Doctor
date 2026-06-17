const { body, validationResult } = require('express-validator');

// Validation runner to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((err) => err.msg).join(', ');
    return res.status(400).json({ message: errorMsg });
  }
  next();
};

// Register validation rules
const registerValidationRules = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['patient', 'doctor'])
    .withMessage('Role must be either patient or doctor'),
  // Fields for doctor profile
  body('specialization')
    .if(body('role').equals('doctor'))
    .notEmpty()
    .withMessage('Specialization is required for doctors'),
  body('experience')
    .if(body('role').equals('doctor'))
    .isNumeric()
    .withMessage('Experience must be a number'),
  body('fees')
    .if(body('role').equals('doctor'))
    .isNumeric()
    .withMessage('Fees must be a number'),
];

// Login validation rules
const loginValidationRules = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Booking validation rules
const bookingValidationRules = [
  body('doctorId').notEmpty().withMessage('Doctor ID is required').isMongoId().withMessage('Invalid Doctor ID format'),
  body('date').notEmpty().withMessage('Appointment date is required').isISO8601().withMessage('Invalid date format (must be YYYY-MM-DD)'),
  body('timeSlot').notEmpty().withMessage('Time slot is required').trim(),
  body('symptoms').notEmpty().withMessage('Symptoms description is required').trim(),
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
  bookingValidationRules,
};
