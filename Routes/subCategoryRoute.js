const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryId,
  filter,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const courseRoute = require("./courseRoute");

const authServices = require("../services/authService");

const router = express.Router({ mergeParams: true });

//Nested Route
router.use("/:subCategoryId/courses", courseRoute);

router.get("/", filter, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router.post(
  "/",
  csrfProtection,
  setCategoryId,
  createSubCategoryValidator,
  createSubCategory
);

router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
