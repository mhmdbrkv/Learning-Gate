const express = require("express");

const csrfProtection = require("../utils/csrfToken");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  getReviewsValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  filter,
  setCourseId,
} = require("../services/reviewServise");

const authServices = require("../services/authService");

const router = express.Router({ mergeParams: true });

router.get("/", filter, getReviewsValidator, getReviews);
router.get("/:id", getReviewValidator, getReview);

router.use(authServices.protect, authServices.isActive);

router
  .route("/")
  .post(
    csrfProtection,
    authServices.allowedTo("student"),
    setCourseId,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .put(authServices.allowedTo("student"), updateReviewValidator, updateReview)
  .delete(
    authServices.allowedTo("student", "instructor"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
