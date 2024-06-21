const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const ApiError = require("../apiError");
const Course = require("../../Models/courseModel");

exports.wishListValidator = [
  check("courseId")
    .isMongoId()
    .withMessage("invalid course id format")
    .custom(async (val, { req }) => {
      const exists = await Course.findById(val);
      if (!exists)
        throw new ApiError(`No course found with this id: ${val}`, 404);
      else return true;
    }),

  validatorMiddleware,
];
