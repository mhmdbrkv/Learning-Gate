const express = require("express");

const authServices = require("../services/authService");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("instructor"));

const { getMyCourses, getMe } = require("../services/instructorService");

router.get("/my-courses", getMyCourses);
router.get("/:id", getMe);
module.exports = router;
