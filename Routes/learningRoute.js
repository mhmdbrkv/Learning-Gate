const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const authServices = require("../services/authService");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("student"));

const {
  myLearningValidator,
} = require("../utils/validators/myLearningValidator");

const {
  getMyLearning,
  addMyLearning,
  removeFromMyLearning,
} = require("../services/learningService");

router.get("/", getMyLearning);
router.post("/:courseId", csrfProtection, myLearningValidator, addMyLearning);
router.delete("/:courseId", myLearningValidator, removeFromMyLearning);

module.exports = router;
