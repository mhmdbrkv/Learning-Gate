const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const ApiError = require("../apiError");
const User = require("../../Models/userModel");

exports.changeLoggeedUserPasswordValidator = [
  check("oldPassword")
    .notEmpty()
    .withMessage("user currentPassword required")

    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);

      if (!user) throw new ApiError("No user found for this id", 404);

      const isMatch = await bcrypt.compare(val, user.password);

      if (!isMatch)
        throw new ApiError("Please enter the current password correctly");

      return true;
    }),

  check("newPassword")
    .notEmpty()
    .withMessage("user password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("user confirmPassword required")
    .custom(async (val, { req }) => {
      if (val !== req.body.password) {
        throw new ApiError("Please enter the exact new password to confirm");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateLoggeedUserDataValidator = [
  check("firstName")
    .optional()
    .isString()
    .withMessage("Invalid user firstname format")
    .isLength({ min: 4 })
    .withMessage("user firstname length must be at least 4 characters"),

  check("lastName")
    .optional()
    .isString()
    .withMessage("Invalid user lastname format")
    .isLength({ min: 4 })
    .withMessage("user lastname length must be at least 4 characters"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid user email format")
    .custom(async (email, { req }) => {
      await User.findOne({ email: email }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("This email already exists", 409));
        }
      });
      return true;
    }),

  check("headline")
    .optional()
    .isLength({ max: 60 })
    .withMessage("headline must be less than 60 character long"),

  check("profileImage").optional(),
  check("biography").optional(),
  check("social").optional(),

  validatorMiddleware,
];
