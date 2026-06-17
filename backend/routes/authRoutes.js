const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validate,
  registerValidationRules,
  loginValidationRules,
} = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);
router.get('/me', protect, getMe);

module.exports = router;
