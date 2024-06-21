const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const subCategoryRoute = require("./subCategoryRoute");
// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const courseRoute = require("./courseRoute");

const authServices = require("../services/authService");

const router = express.Router();

//Nested Route
router.use("/:categoryId/subcategories", subCategoryRoute);
router.use("/:categoryId/courses", courseRoute);

router.get("/", getCategories);
router.get("/:id", getCategoryValidator, getCategory);

router.use(
  authServices.protect,
  authServices.allowedTo("instructor"),
  authServices.isActive
);

router.post("/", csrfProtection, createCategoryValidator, createCategory);

router
  .route("/:id")
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
