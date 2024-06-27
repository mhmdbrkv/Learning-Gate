const express = require("express");

const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

const {
  myLearningValidator,
} = require("../utils/validators/myLearningValidator");

const {
  getMyLearning,
  addMyLearning,
  removeFromMyLearning,
} = require("../services/learningService");

router.use(protect, allowedTo("student"));

router.get("/", getMyLearning);
router.post("/:courseId", myLearningValidator, addMyLearning);
router.delete("/:courseId", myLearningValidator, removeFromMyLearning);

module.exports = router;
