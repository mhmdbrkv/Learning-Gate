const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const Coupon = require("../../Models/couponModel");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("coupon name required")
    .custom(async (val, { req }) => {
      const coupon = await Coupon.findOne({ name: val });
      if (coupon) throw new Error("coupon already exists with the same name");
    }),
  check("expire")
    .notEmpty()
    .withMessage("coupon expire date value required")
    .custom((val, { req }) => {
      if (new Date(val).getTime() <= Date.now()) {
        throw new Error(
          `coupon expire date must be greater than the current date:
          ${new Date().toDateString()}`
        );
      }
      return true;
    }),
  check("discount")
    .notEmpty()
    .withMessage("coupon discount value required")
    .isNumeric()
    .withMessage("discount must be a number"),

  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("invalid coupon id format"),
  check("name")
    .optional()
    .custom(async (val, { req }) => {
      const coupon = await Coupon.findOne({ name: val });
      if (coupon) throw new Error("coupon already exists with the same name");
    }),
  check("expire")
    .optional()
    .custom((val, { req }) => {
      if (new Date(val).getTime() <= Date.now()) {
        throw new Error(
          `coupon expire date must be greater than the current date:
          ${new Date().toDateString()}`
        );
      }
      return true;
    }),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("discount must be a number"),

  validatorMiddleware,
];
exports.idCouponValidator = [
  check("id").isMongoId().withMessage("invalid coupon id format"),

  validatorMiddleware,
];
