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
    .populate({
      path: "myCourses",
      select: "title subtitle price enrolled ratingsNumber avgRatings",
    })
    .select("-password");

  if (!user) {
    throw new ApiError(`No document with the id of ${req.params.id}`, 404);
  }

  const data = {};

  if (user.role === "instructor") {
    let numberOfStudents = 0;
    let numberOfReviews = 0;

    user.myCourses.forEach((course) => {
      numberOfStudents += course.enrolled;
      numberOfReviews += course.ratingsNumber;
    });

    data.numberOfStudents = numberOfStudents;
    data.numberOfReviews = numberOfReviews;
  }

  data.user = user;

  res.status(200).json({ status: true, data: data });
});

// @desc    Change logged user password
// @route   PUT /api/v1/users/change-my-password
// @access  Private/Protect
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 11),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  generateToken(user._id, res);
  res.status(200).json({
    status: true,
    message: "Password changed successfully",
  });
});

// @desc    Set loggged user profile image
// @route   POST /api/v1/users/my-profile-image
// @access  Private
exports.setProfileImage = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    profileImage: {
      url: req.result.secure_url,
      public_id: req.result.public_id,
    },
  });

  res.status(200).json({
    status: true,
    message: "Image uploaded successfully",
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
    status: true,
    message: "Image removed successfully",
  });
});

// @desc    Update loggged user data
// @route   PUT /api/v1/users/update-my-data
// @access  Private
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    headline: req.body.headline,
    biography: req.body.biography,
    $addToSet: { social: req.body.social },
  });

  res.status(200).json({
    status: true,
    message: "Updated successfully",
  });
});

// @desc    deActivate loggged user data
// @route   PUT /api/v1/users/deActivate
// @access  Private
exports.deActivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(204).json({
    status: true,
    message: "User deActivated successfully",
  });
});

// @desc    activate loggged user data
// @route   PUT /api/v1/users/activate
// @access  Private
exports.activateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: true });
  res.status(200).json({
    status: true,
    message: "User activated successfully",
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
    status: true,
    message: "Added to interests successfully",
    data: user.interests,
  });
});
