const asyncHandler = require("express-async-handler");
// eslint-disable-next-line import/no-unresolved
const Course = require("../Models/courseModel");
const User = require("../Models/userModel");
const ApiError = require("../utils/apiError");

// @desc    Get instructor courses
// @route   GET /api/v1/instructor/my-courses
// @access  Protected/instructor
exports.getMyCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user._id }).populate(
    "sections reviews"
  );
  res.status(200).json({
    success: true,
    results: courses.length,
    data: courses,
  });
});

// @desc    Get instructor courses
// @route   GET /api/v1/instructor/:id
// @access  Protected/instructor
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "myCourses",
      select:
        "title subtitle price enrolled ratingsNumber thumbnail avgRatings",
    })
    .select("-password -myLearning -wishList");

  if (!user) {
    throw new ApiError(`No instructor found`, 404);
  }

  if (user.accountType === "instructor") {
    let numberOfStudents = 0;
    let numberOfReviews = 0;

    user.myCourses.forEach((course) => {
      numberOfStudents += course.enrolled;
      numberOfReviews += course.ratingsNumber;
    });

    user.totalStudents = numberOfStudents;
    user.totalReviews = numberOfReviews;
  }

  res.status(200).json({ success: true, data: user });
});
