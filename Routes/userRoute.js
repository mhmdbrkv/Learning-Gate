const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  changeLoggeedUserPasswordValidator,
  updateLoggeedUserDataValidator,
} = require("../utils/validators/userValidator");

const {
  getUser,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deActivateLoggedUser,
  activateLoggedUser,
  setProfileImage,
  removeProfileImage,
  addToInterests,
} = require("../services/userService");

const { uploadOnCloudinary } = require("../Middlewares/cloudinaryMiddleware");
const { uploadImage } = require("../utils/multer");

const authServices = require("../services/authService");

const router = express.Router();

router.use(authServices.protect);
router.put("/activate-me", activateLoggedUser);
router.delete("/deActivate-me", deActivateLoggedUser);

router.use(authServices.isActive);

router.get("/get-me", getUser);

router.use(csrfProtection);

router.post("/interests", addToInterests);

router.post(
  "/my-profile-image",
  uploadImage.single("profileImage"),
  uploadOnCloudinary("users"),
  setProfileImage
);

router.delete("/my-profile-image", removeProfileImage);

router.post(
  "/change-my-password",
  changeLoggeedUserPasswordValidator,
  changeLoggedUserPassword
);
router.post(
  "/update-my-data",
  updateLoggeedUserDataValidator,
  updateLoggedUserData
);

module.exports = router;
