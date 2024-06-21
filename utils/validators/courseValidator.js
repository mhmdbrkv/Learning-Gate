const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const Course = require("../../Models/courseModel");
const Category = require("../../Models/categoryModel");
const SubCategory = require("../../Models/subCategoryModel");
const User = require("../../Models/userModel");

exports.getCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  validatorMiddleware,
];

exports.createCousreValidator = [
  check("title")
    .notEmpty()
    .withMessage("course title required")
    .isString()
    .withMessage("Invalid course title format")
    .isLength({ min: 12, max: 60 })
    .withMessage("course title length must be between 12 and 150 words")
    .custom(async (val, { req }) => {
      const course = await Course.findOne({ title: val });
      if (course) {
        throw new Error(`Course ${course.title} has already been created`);
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check("subtitle")
    .notEmpty()
    .withMessage("Course subtitle Required")
    .isLength({ min: 12, max: 120 })
    .withMessage("Course subtitle length must be between 50 and 500 words"),

  check("category")
    .notEmpty()
    .withMessage("Category id Required")
    .isMongoId()
    .withMessage("Invalid category id format")

    .custom(async (value) => {
      const categoryExist = await Category.findById(value);
      if (!categoryExist)
        throw new Error(`This category id: ${value} does not exist! `);
    }),

  check("subCategories")
    .optional()
    .custom(async (IDs) => {
      const result = await SubCategory.find({
        _id: { $exists: true, $in: IDs },
      });
      if (result.length < 1 || result.length !== IDs.length) {
        throw new Error("Some of the provided sub categories ids are invalid");
      }
    })

    .custom(async (value, { req }) => {
      const result = await SubCategory.find({
        category: req.body.category,
      });

      const subCategoriesDB = [];

      result.forEach((ele) => {
        subCategoriesDB.push(ele._id.toString());
      });

      value.forEach((e) => {
        if (!subCategoriesDB.includes(e)) {
          throw new Error(
            `The selected sub-category with id: ${e} do not belong to this main category!`
          );
        }
      });
    }),

  check("duration")
    .notEmpty()
    .withMessage("duration required")
    .isNumeric()
    .withMessage("Invalid course duration format"),

  check("instructor")
    .optional()
    .notEmpty()
    .withMessage("instructor id required")
    .isMongoId()
    .withMessage("Invalid instructor id format")
    .custom(async (value, { req }) => {
      const roles = ["instructor"];
      const user = await User.findById(value);
      if (!user || !roles.includes(user.role)) {
        throw new Error(
          "The inserted id of the instructor field does not belong to instructor"
        );
      }
    }),

  check("languages").notEmpty().withMessage("languages required"),
  check("price")
    .notEmpty()
    .withMessage("price required")
    .isNumeric()
    .withMessage("invalid price format")
    .toFloat(),

  check("learningGoals").notEmpty().withMessage("learning goals required"),
  check("requirements").notEmpty().withMessage("requirements required"),
  check("level")
    .notEmpty()
    .withMessage("level required")
    .isString()
    .withMessage("Course level required as string"),

  check("description")
    .notEmpty()
    .withMessage("description required")
    .isLength({ min: 200 })
    .withMessage("Course description length must be 200 words minimum"),

  check("sideMeta")
    .optional()
    .isArray()
    .withMessage("Course side meta data required as array"),
  validatorMiddleware,
];

exports.updateCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  check("title")
    .optional()
    .isString()
    .withMessage("invalid title format")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("instructor")
    .optional()
    .isMongoId()
    .withMessage("Invalid instructor id format")
    .custom(async (value, { req }) => {
      const roles = ["instructor"];
      const user = await User.findById(value);
      if (!user || !roles.includes(user.role)) {
        throw new Error(
          "The inserted id of the instructor field does not belong to instructor"
        );
      }
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id format")
    .custom(async (value) => {
      const categoryExist = await Category.findById(value);
      if (!categoryExist)
        throw new Error(`This category id: ${value} does not exist! `);
    }),

  check("subCategories")
    .optional()
    .custom(async (value, { req }) => {
      const course = await Course.findById(req.params.id);
      const categoryId = course.category._id;

      const result = await SubCategory.find({
        category: categoryId,
      });

      const subCategoriesDB = [];

      result.forEach((ele) => {
        subCategoriesDB.push(ele._id.toString());
      });

      value.forEach((e) => {
        if (!subCategoriesDB.includes(e)) {
          throw new Error(
            `The selected sub-category with id: ${e} do not belong to this main category!`
          );
        }
      });
    }),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("invalid price format")
    .toFloat(),

  validatorMiddleware,
];

exports.deleteCousreValidator = [
  check("id").isMongoId().withMessage("invalid course id format"),
  validatorMiddleware,
];
