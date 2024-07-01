const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  addSectionValidator,
  addlectureValidator,
  lectureValidator,
  updateSectionValidator,
} = require("../utils/validators/sectionValidator");

const {
  getSections,
  getLectures,
  addSection,
  addLecture,
  removeLecture,
  updateSection,
  updateLecture,
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
  lectureValidator,
  removeLecture
);

router.put(
  "/:sectionId/update-lecture/:lectureId",
  lectureValidator,
  updateLecture
);

router.post("/:courseId", csrfProtection, addSectionValidator, addSection);
router.put("/:sectionId", updateSectionValidator, updateSection);

module.exports = router;
