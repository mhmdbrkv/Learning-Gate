const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const handler = require("./handlersFactory");
const Course = require("../Models/courseModel");
const User = require("../Models/userModel");

// Nested post route
exports.postFilter = async (req, res, next) => {
  if (req.body.subCategory) {
    req.body.subCategories = [];
    req.body.subCategories.push(req.body.subCategory);
  }

  next();
};

// Nested get route
exports.getFilter = async (req, res, next) => {
  let filter = {};

  // get all courses of a specific category
  if (req.params.categoryId) filter = { category: req.params.categoryId };

  // get all courses of a specific sub category
  if (req.params.subCategoryId)
    filter = { subCategories: { $in: req.params.subCategoryId } };

  req.filter = filter;
  next();
};

// @desc    Get list of courses
// @route   GET /api/v1/courses
// @access  Public
exports.getCourses = handler.gettAll(Course, "Course");

// @desc    Get specific course by id
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = handler.getOne(Course, "reviews sections");

// @desc    Get popular courses
// @route   GET /api/v1/courses/popular
// @access  Public
exports.getPopularCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find()
    .select("title subtitle avgRatings enrolled thumbnail")
    .sort({ avgRatings: -1, enrolled: -1 })
    .limit(10);

  res.status(200).json({
    status: true,
    result: courses.length,
    data: courses,
  });
});

// @desc    Get courses by interests
// @route   GET /api/v1/users/interests
// @access  Public
exports.getCoursesByInterests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const newInterests = [];

  user.interests.forEach((item) => {
    newInterests.push(new RegExp(item, "i"));
  });

  const courses = await Course.find({
    $or: [
      { title: { $in: newInterests } },
      { subtitle: { $in: newInterests } },
    ],
  }).select(
    "-description -duration -subCategories -learningGoals -languages -requirements -sideMeta"
  );

  res.status(200).json({
    status: true,
    result: courses.length,
    data: courses,
  });
});

// @desc    Set Thumbnail
// @route   POST  /api/v1/courses/:courseId
// @access  Private/Instructor
exports.setThumbnail = asyncHandler(async (req, res) => {
  req.body.thumbnail = {
    url: req.result.secure_url,
    public_id: req.result.public_id,
  };

  await Course.findOneAndUpdate(
    { _id: req.body.courseId },
    { thumbnail: req.body.thumbnail }
  );

  res.status(201).json({
    status: true,
    message: "thumbnail has been sat successfully",
  });
});

// @desc    Create course
// @route   POST  /api/v1/courses/create-course
// @access  Private/Instructor
exports.createCourse = asyncHandler(async (req, res) => {
  req.body.instructor = req.user._id;
  req.body.thumbnail = {
    url: req.result.secure_url,
    public_id: req.result.public_id,
  };

  const newCourse = await Course.create(req.body);
  await User.findOneAndUpdate(
    { _id: newCourse.instructor },
    { $addToSet: { myCourses: newCourse._id } }
  );
  res
    .status(201)
    .json({ status: true, message: "Created successfully", data: newCourse });
});

// @desc    Update specific course
// @route   PUT /api/v1/courses/:id
// @access  Private/Instructor
exports.updateCourse = handler.updateOne(Course);

// @desc    Delete specific course
// @route   Delete /api/v1/courses/:id
// @access  Private/Instructor
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ApiError(`No course for this id ${req.params.id}`, 404));
  }

  await User.findOneAndUpdate(
    { _id: course.instructor },
    { $pull: { myCourses: course._id } }
  );

  await Course.deleteOne({ _id: req.params.id });

  res.status(204).send();
});
