const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const handler = require("./handlersFactory");
const Review = require("../Models/reviewModel");
const Course = require("../Models/courseModel");

// Aggregation function
const aggregateRatings = async function (courseId, reviewModel, courseModel) {
  const result = await reviewModel.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        avgRatings: { $avg: "$rating" },
        ratingsNumber: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await courseModel.findByIdAndUpdate(courseId, {
      avgRatings: result[0].avgRatings,
      ratingsNumber: result[0].ratingsNumber,
    });
  }
};

// Nested route POST
exports.setCourseId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// Nested route GET
exports.filter = (req, res, next) => {
  let filter = {};

  if (req.params.courseId) filter = { course: req.params.courseId };

  req.filter = filter;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = handler.gettAll(Review, "Review");

// @desc    Get random reviews
// @route   GET /api/v1/reviews/random
// @access  Public
exports.getRandomReviews = asyncHandler(async (req, res) => {
  const numOfDocument = await Review.countDocuments();
  const reviews = await Review.aggregate([
    { $sample: { size: numOfDocument } },
  ]);

  res.status(201).json({ status: true, data: reviews });
});

// @desc    Get specific Review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = handler.getOne(Review);

// @desc    Create Review
// @route   POST  /api/v1/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);

  //Applying aggregation after creating a review
  aggregateRatings(
    new mongoose.Types.ObjectId(req.body.course),
    Review,
    Course
  );

  res
    .status(201)
    .json({ status: true, message: "Created successfully", data: review });
});

// @desc    Update specific Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = handler.updateOne(Review);

// @desc    Delete specific Review
// @route   Delete /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return next(new Error(`No review for this id ${id}`));
  }

  await Review.deleteOne({ _id: id });

  //Apply aggregation after deleting a review
  aggregateRatings(review.course, Review, Course);

  res.status(204).send();
});
