const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/apiError");
const User = require("../Models/userModel");
const { removeFromCloudinary } = require("../Middlewares/cloudinaryMiddleware");

// @desc    Get loggged user
// @route   GET /api/v1/users/get-me
// @access  Private
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate([
      {
        path: "myLearning",
        select: "title subtitle price thumbnail avgRatings",
      },
      {
        path: "wishList",
        select: "title subtitle price thumbnail avgRatings",
      },
    ])
    .select("-password -myCourses");

  if (!user) {
    throw new ApiError(`No student found}`, 404);
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Change logged user password
// @route   PUT /api/v1/users/change-my-password
// @access  Private/Protect
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 11),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  generateToken(user._id, res);
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// @desc    Set loggged user profile image
// @route   POST /api/v1/users/my-profile-image
// @access  Private
exports.setProfileImage = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    profileImage: {
      url: req.result.secure_url,
      public_id: req.result.public_id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: user,
  });
});

// @desc    Remove loggged user profile image
// @route   PUT /api/v1/users/my-profile-image
// @access  Private
exports.removeProfileImage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // remove image from cloudinary
  removeFromCloudinary(user.profileImage.public_id, "image");

  user.profileImage = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Image removed successfully",
  });
});

// @desc    Update loggged user data
// @route   PUT /api/v1/users/update-my-data
// @access  Private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    headline: req.body.headline,
    biography: req.body.biography,
    $addToSet: { social: req.body.social },
  });

  res.status(200).json({
    success: true,
    message: "Updated successfully",
    data: user,
  });
});

// @desc    deActivate loggged user data
// @route   PUT /api/v1/users/deActivate
// @access  Private
exports.deActivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(204).json({
    success: true,
    message: "User deActivated successfully",
  });
});

// @desc    activate loggged user data
// @route   PUT /api/v1/users/activate
// @access  Private
exports.activateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: true });
  res.status(200).json({
    success: true,
    message: "User activated successfully",
  });
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(204).json({
    success: true,
    message: "User deleted successfully",
  });
});

// @desc    Add courses by interests
// @route   POST /api/v1/users/interests
// @access  Public
exports.addToInterests = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { interests: req.body.interests },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Added to interests successfully",
    data: user.interests,
  });
});
