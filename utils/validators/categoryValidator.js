const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const Category = require("../../Models/categoryModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Required")
    .isString()
    .withMessage("Invalid name format")
    .isLength({ min: 3, max: 32 })
    .withMessage("Name length must be between 3 and 32 characters")
    .custom(async (val, { req }) => {
      const category = await Category.findOne({ name: val });
      if (category) {
        throw new Error("Category already exists!");
      }
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(async (val, { req }) => {
      const category = await Category.findById(val);
      if (!category) throw new Error("No category found");
      return true;
    }),
  check("name")
    .optional()
    .isString()
    .withMessage("invalid name format")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];
