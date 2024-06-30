/* eslint-disable prefer-destructuring */
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { sanitizeUser } = require("../utils/sanitizeData");
const User = require("../Models/userModel");

// @desc    createUser
// @route   POST /api/v1/auth/create-user
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
  // Create a new user
  const user = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    headline: req.body.headline,
    biography: req.body.biography,
    social: req.body.social,
    role: req.body.role,
  });

  // Sanitizer function to return only nessesary data
  const data = sanitizeUser(user);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data,
  });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new ApiError("Incorrect email or password", 401);
  }

  //generate the jwt
  const token = generateToken(user);

  // Sanitizer function to return only nessesary data
  const data = sanitizeUser(user);

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data,
    token,
  });
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exists in request header
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Check for token in request body
  else if (req.body && req.body.token) {
    token = req.body.token;
  }
  // Handle the case where no token is found
  else {
    token = null;
  }

  if (!token)
    return next(new ApiError("Not authorized to perform this action.", 401));

  // 2) verify token (no changes happened, expiration)
  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (e) {
    throw new ApiError("Something went wrong, Please log in again.", 401);
  }

  // 3) check user state
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(
      "This account is not authorised. Please log in again.",
      401
    );
  }

  // 4) check if user chang the password after the creation of token
  if (user.passChangedAt) {
    const passChangedTime = parseInt(user.passChangedAt.getTime() / 1000, 10);
    if (passChangedTime > decoded.iat) {
      throw new ApiError(
        "There was a problem with verifying  your account. Please log in again.",
        401
      );
    }
  }

  req.user = user;
  next();
});

// @desc    make sure the user is active
exports.isActive = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user.isActive) {
    throw new ApiError("This acount is unactive, please reactivate it", 401);
  }
  next();
});

// @desc    Authorization (User Permissions)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new ApiError("You are not allowed to perfom this action", 403);

    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Protected
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Check user's email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new ApiError(`No user found with this email: ${req.body.email}`, 404);

  // 2) Generate a reset code
  const random = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCode = crypto.createHash("sha256").update(random).digest("hex");

  // 3) Save the reset code in the database
  user.passResetCode = resetCode; // reset code
  user.passResetCodeEat = Date.now() + 10 * 60 * 1000; // reset code expires  in 10 mins
  user.passResetCodeVerified = false; //  set reset code as unverified
  await user.save();

  // 4) Send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: `Password reset code (valid for 10 mins)`,
      message: `Hi ${user.firstname},\nWe sent the code ${random} to reset your password.\n\nThe Golden Gate family`,
    });
  } catch (err) {
    user.passResetCode = undefined;
    user.passResetCodeEat = undefined;
    user.passResetCodeVerified = undefined;
    await user.save();
    throw new ApiError(err, 500);
  }

  res.status(200).json({
    success: true,
    message: `Email sent successfully to ${user.email}`,
  });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verify-reset-code
// @access  Protected
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const code = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passResetCode: code,
    passResetCodeEat: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired password reset code", 400);

  user.passResetCodeVerified = true;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password reset code is verified" });
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Protected
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError("No user found  with this email address.", 404);

  if (!user.passResetCodeVerified)
    throw new ApiError("Please verify your password reset code first.", 400);

  user.password = req.body.newPassword;
  user.passResetCode = undefined;
  user.passResetCodeEat = undefined;
  user.passResetCodeVerified = undefined;

  await user.save();

  //generate the jwt
  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Password has been reseted.",
    token,
  });
});
