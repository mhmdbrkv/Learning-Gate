const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  createCouponValidator,
  updateCouponValidator,
  idCouponValidator,
} = require("../utils/validators/couponValidator");

const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const authServices = require("../services/authService");

const router = express.Router();

router.use(
  authServices.protect,
  authServices.isActive,
  authServices.allowedTo("instructor")
);

router
  .route("/")
  .get(getCoupons)
  .post(createCouponValidator, csrfProtection, createCoupon);

router
  .route("/:id")
  .get(idCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(idCouponValidator, deleteCoupon);

module.exports = router;
