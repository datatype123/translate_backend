const express = require('express');
const router = express.Router();
const {
  validateRegisterInput,
  validateLoginInput,
  validateResetPasswordInput,
  validateUpdatePasswordInput,
  checkValidation,
  loginUser,
  registerUser,
  resetPassword,
  updatePassword,
} = require('../controllers/auth/AuthUser');

// Utility function to standardize API responses
const sendResponse = (res, status, message, data = null, error = null) => {
  const response = { message };
  if (data) response.data = data;
  if (error) response.error = error.message;
  return res.status(status).json(response);
};

//TODO: viet lai phan reset password hien tai dang gap bug la khong the reset duoc password do access token khong hop le

// Route: Register
router.post('/register', validateRegisterInput, checkValidation, async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userData = await registerUser(email, password, username);
    return sendResponse(res, 201, 'Registration successful', userData);
  } catch (error) {
    return sendResponse(res, 400, 'Registration failed', null, error);
  }
});

// Route: Login
router.post('/login', validateLoginInput, checkValidation, async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await loginUser(email, password);
    return sendResponse(res, 200, 'Login successful', userData);
  } catch (error) {
    return sendResponse(res, 401, 'Invalid email or password', null, error);
  }
});

// Route: Initiate password reset
router.post('/reset-password', validateResetPasswordInput, checkValidation, async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await resetPassword(email);
    return sendResponse(res, 200, 'Password reset email sent', userData);
  } catch (error) {
    return sendResponse(res, 400, 'Password reset failed', null, error);
  }
});

// Route: Update password (handles reset link)
router.post('/update-password', validateUpdatePasswordInput, checkValidation, async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const userData = await updatePassword(token, newPassword);
    return sendResponse(res, 200, 'Password updated successfully', userData);
  } catch (error) {
    return sendResponse(res, 400, 'Password update failed', null, error);
  }
});

module.exports = router;