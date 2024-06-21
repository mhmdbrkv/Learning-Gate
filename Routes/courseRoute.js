const express = require("express");
const upload = require("multer")();
const csrfProtection = require("../utils/csrfToken");

const {
  createCousreValidator,
  getCousreValidator,
  updateCousreValidator,
  deleteCousreValidator,
} = require("../utils/validators/courseValidator");

const {
  createCourse,
  setThumbnail,
  getCourses,
  getCourse,
  getPopularCourses,
  deleteCourse,
  updateCourse,
  getCoursesByInterests,
  getFilter,
  postFilter,
} = require("../services/courseService");

const reviewRoute = require("./reviewRoute");
const authServices = require("../services/authService");
const { uploadOnCloudinary } = require("../Middlewares/cloudinaryMiddleware");
const { uploadImage } = require("../utils/multer");

const router = express.Router({ mergeParams: true });

//Nested Route
router.use("/:courseId/reviews", reviewRoute);

router.get("/", getFilter, getCourses);
router.get("/popular", getPopularCourses);
router.get("/interests", getCoursesByInterests);

router.get("/:id", getCousreValidator, getCourse);

router.use(
  authServices.protect,
  authServices.allowedTo("instructor"),
  authServices.isActive
);

router.post(
  "/create-course",
  csrfProtection,
  upload.any(),
  postFilter,
  createCousreValidator,
  uploadImage.single("thumbnail"),
  uploadOnCloudinary("courses"),
  createCourse
);

router.post(
  "/:courseId/set-thumbnail",
  csrfProtection,
  uploadImage.single("thumbnail"),
  uploadOnCloudinary("courses"),
  setThumbnail
);

router
  .route("/:id")
  .put(postFilter, updateCousreValidator, updateCourse)
  .delete(deleteCousreValidator, deleteCourse);

module.exports = router;
