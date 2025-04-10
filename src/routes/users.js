const express = require('express');
const router = express.Router();
const {
  validateRegisterInput,
  validateLoginInput,
  checkValidation,
  loginUser
} = require('../controllers/auth/AuthUser');

// Route: Đăng ký
router.post('/register', validateRegisterInput, checkValidation, (req, res) => {
  const { username, email } = req.body;
  res.json({
    message: `Đăng ký thành công cho ${username}`,
    data: { username, email },
  });
});

// Route: Đăng nhập
router.post(
    '/login',
    validateLoginInput,
    checkValidation,
    async (req, res) => {
      const { email, password } = req.body;
      try {
        const userData = await loginUser(email, password);
        console.log(userData);
        
        res.status(200).json({
          message: 'Đăng nhập thành công',
          data
        });
      } catch (error) {
        res.status(401).json({
          message: 'Sai username hoặc password',
          error: error.message,
        });
      }
    }
  );

module.exports = router;