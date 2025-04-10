const { body, validationResult } = require("express-validator");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

// Validate cho route /register
const validateRegisterInput = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username không được để trống")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username phải từ 3 đến 20 ký tự")
    .bail()
    .isAlphanumeric()
    .withMessage("Username chỉ được chứa chữ cái và số"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải ít nhất 6 ký tự")
    .bail()
    .matches(/^(?=.*\d)(?=.*[a-zA-Z]).*$/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số"),
];

// Validate cho route /login
const validateLoginInput = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

// Middleware kiểm tra lỗi validate
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: errors
        .array()
        .map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

const loginUser = async (email, password) => {
  try {
    const { data } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error.message);
    throw error;
  }
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  checkValidation,
  loginUser,
};
