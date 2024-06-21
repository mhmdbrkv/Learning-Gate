const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");

exports.addCartItemValidator = [
  check("courseId").isMongoId().withMessage("Course Id must be a mongoose id"),

  validatorMiddleware,
];
exports.removeCartItemValidator = [
  check("courseId").isMongoId().withMessage("Course Id must be a mongoose id"),

  validatorMiddleware,
];
