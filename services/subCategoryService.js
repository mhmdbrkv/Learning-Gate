const SubCategory = require("../Models/subCategoryModel");
const handler = require("./handlersFactory");

// Nested route POST
exports.setCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route GET
exports.filter = (req, res, next) => {
  let filter = {};

  if (req.params.categoryId) filter = { category: req.params.categoryId };

  req.filter = filter;
  next();
};

// @desc    Get list of subCategories by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategories = handler.gettAll(SubCategory);

// @desc    Get specific subCategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = handler.getOne(SubCategory);

// @desc    Create subCategory
// @route   POST  /api/v1/subcategories
// @access  Private
exports.createSubCategory = handler.createOne(SubCategory);

// @desc    Update specific subCategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = handler.updateOne(SubCategory);

// @desc    Delete specific subCategory
// @route   Delete /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = handler.deleteOne(SubCategory);
