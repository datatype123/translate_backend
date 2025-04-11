const { body, validationResult } = require('express-validator');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in .env');
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Validation rules for /register
const validateRegisterInput = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .bail()
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .bail()
    .matches(/^(?=.*\d)(?=.*[a-zA-Z]).*$/)
    .withMessage('Password must contain at least one letter and one number'),
  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm password is required')
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Validation rules for /login
const validateLoginInput = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for /reset-password
const validateResetPasswordInput = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
];

// Validation rules for /update-password (new endpoint)
const validateUpdatePasswordInput = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .bail()
    .matches(/^(?=.*\d)(?=.*[a-zA-Z]).*$/)
    .withMessage('New password must contain at least one letter and one number'),
];

// Middleware to check validation errors
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Authenticate user login
const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Register a new user
const registerUser = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Initiate password reset
const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/update-password?access_token=<new_token>&type=recovery',
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Update password using reset token
const updatePassword = async (token, newPassword) => {
  // Verify the reset token
  const { data: sessionData, error: sessionError } = await supabase.auth.verifyOtp({
    token,
    type: 'recovery',
  });
  if (sessionError) {
    throw new Error('Invalid or expired reset token');
  }

  // Update the password
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateResetPasswordInput,
  validateUpdatePasswordInput,
  checkValidation,
  loginUser,
  registerUser,
  resetPassword,
  updatePassword,
};