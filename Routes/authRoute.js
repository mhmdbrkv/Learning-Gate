const express = require("express");

const csrfProtection = require("../utils/csrfToken");

const {
  createUserValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  createUser,
  login,
  protect,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

// csrf token endpoint
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post("/create-user", createUserValidator, createUser);
router.post("/login", loginValidator, login);

router.use(protect);
router.post("/forgot-password", csrfProtection, forgotPassword);
router.post("/verify-reset-code", csrfProtection, verifyResetCode);
router.post("/reset-password", csrfProtection, resetPassword);

module.exports = router;
