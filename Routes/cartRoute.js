const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  removeCartItemValidator,
  addCartItemValidator,
} = require("../utils/validators/cartValidator");

const {
  addToCart,
  getLoggedUserCart,
  removeCartItem,
  applyCoupon,
} = require("../services/cartService");

const authServices = require("../services/authService");

const router = express.Router();

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("student")
);

router
  .route("/")
  .post(addCartItemValidator, csrfProtection, addToCart)
  .get(getLoggedUserCart);
router.route("/:courseId").delete(removeCartItemValidator, removeCartItem);

router.post("/apply-coupon", csrfProtection, applyCoupon);
module.exports = router;
