const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const authServices = require("../services/authService");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("student"));

const { wishListValidator } = require("../utils/validators/wishListValidator");

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../services/wishlistService");

router.route("/").get(getWishlist);
router.post("/:courseId", csrfProtection, wishListValidator, addToWishlist);
router.delete("/:courseId", wishListValidator, removeFromWishlist);

module.exports = router;
