const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  addSectionValidator,
  addlectureValidator,
  removelectureValidator,
  updatelectureValidator,
} = require("../utils/validators/sectionValidator");

const {
  getSections,
  getLectures,
  addSection,
  addLecture,
  removeLecture,
  updateSection,
} = require("../services/sectionService");

const authServices = require("../services/authService");
const { uploadOnCloudinary } = require("../Middlewares/cloudinaryMiddleware");
const { uploadVideo } = require("../utils/multer");

const router = express.Router();

router.get("/:courseId", getSections);
router.get("/:sectionId/lectures", getLectures);

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router.post(
  "/:sectionId/add-lecture",
  csrfProtection,
  uploadVideo.single("lecture"),
  addlectureValidator,
  uploadOnCloudinary("lectures"),
  addLecture
);

router.delete(
  "/:sectionId/remove-lecture/:lectureId",
  removelectureValidator,
  removeLecture
);

router.post("/:courseId", csrfProtection, addSectionValidator, addSection);
router.put("/:sectionId", updatelectureValidator, updateSection);

module.exports = router;
