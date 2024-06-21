const handler = require("./handlersFactory");
const Category = require("../Models/categoryModel");

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = handler.gettAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = handler.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = handler.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = handler.updateOne(Category);

// @desc    Delete specific category
// @route   Delete /api/v1/categories/:id
// @access  Private
exports.deleteCategory = handler.deleteOne(Category);
