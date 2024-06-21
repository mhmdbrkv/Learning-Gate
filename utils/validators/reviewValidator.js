const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const User = require("../../Models/userModel");
const Course = require("../../Models/courseModel");
const Review = require("../../Models/reviewModel");

exports.createReviewValidator = [
  check("user")
    .isMongoId()
    .withMessage("user id required in a valid format")
    .custom(async (value) => {
      const userExist = await User.findById(value);
      if (!userExist) throw new Error(`No user found with This id: ${value}`);
    }),
  check("course")
    .isMongoId()
    .withMessage("invalid course id format")
    .custom(async (value) => {
      const courseExist = await Course.findById(value);
      if (!courseExist)
        throw new Error(`No course found with This id: ${value}`);
    })
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        user: req.user._id,
        course: req.body.course,
      });
      if (review)
        throw new Error("You have already reviewed this course before");
      return true;
    }),
  check("content").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Please enter your rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating should be between 1 to 5"),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review id format"),
  validatorMiddleware,
];

exports.getReviewsValidator = [
  check("courseId")
    .optional()
    .isMongoId()
    .withMessage("invalid course id format")
    .custom(async (value) => {
      const courseExist = await Course.findById(value);
      if (!courseExist)
        throw new Error(`No courses found with This id: ${value}`);
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await Review.findOne({
        _id: val,
        user: req.user._id,
      });
      if (!review)
        throw new Error(
          "You are not allowed to perform this operation on this review"
        );
      return true;
    }),
  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating should be between 1 to 5"),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findOne({
          _id: val,
          user: req.user._id,
        });
        if (!review)
          throw new Error(
            "You are not allowed to perform this operation on this review"
          );
      }
      return true;
    }),
  validatorMiddleware,
];
