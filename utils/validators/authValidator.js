const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const ApiError = require("../apiError");
const User = require("../../Models/userModel");

exports.createUserValidator = [
  check("firstname")
    .notEmpty()
    .withMessage("user firstname required")
    .isString()
    .withMessage("Invalid user firstname format")
    .isLength({ min: 4 })
    .withMessage("user firstname length must be at least 4 characters"),

  check("lastname")
    .optional()
    .isString()
    .withMessage("Invalid user lastname format")
    .isLength({ min: 4 })
    .withMessage("user lastname length must be at least 4 characters"),

  check("email")
    .notEmpty()
    .withMessage("user email Required")
    .isEmail()
    .withMessage("Invalid user email format")
    .custom(async (email, { req }) => {
      await User.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("This email already exists", 409));
        }
      });
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("password Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation Required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new ApiError("password unmatched confirmation", 404);
      }
      return true;
    }),

  check("headline")
    .optional()
    .notEmpty()
    .withMessage("headline required")
    .isLength({ max: 60 })
    .withMessage("headline must be less than 60 character long"),

  check("biography").optional().notEmpty().withMessage("biography required"),

  check("social").optional().notEmpty().withMessage("social required"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("user email Required")
    .isEmail()
    .withMessage("Invalid user email format"),

  check("password")
    .notEmpty()
    .withMessage("password Required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validatorMiddleware,
];
