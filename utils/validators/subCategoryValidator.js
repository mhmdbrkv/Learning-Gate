const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const Category = require("../../Models/categoryModel");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Required")
    .not()
    .isNumeric()
    .withMessage("Invalid name format")
    .isLength({ min: 2, max: 32 })
    .withMessage("Name length must be between 3 and 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category id Required")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom(async (val, { req }) => {
      const isExist = await Category.findById(val);
      if (!isExist) {
        throw new Error(`This category with id:${val} does not exist!`);
      }
    }),

  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  check("name")
    .not()
    .isNumeric()
    .withMessage("invalid name format")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom(async (val, { req }) => {
      const isExist = await Category.findById(val);
      if (!isExist) {
        throw new Error(`This category with id:${val} does not exist!`);
      }
    }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];
