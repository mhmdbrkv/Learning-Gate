const handler = require("./handlersFactory");
const Coupon = require("../Models/couponModel");

// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private
exports.getCoupons = handler.gettAll(Coupon);

// @desc    Get specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private
exports.getCoupon = handler.getOne(Coupon);

// @desc    Create coupon
// @route   POST  /api/v1/coupons
// @access  Private
exports.createCoupon = handler.createOne(Coupon);

// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private
exports.updateCoupon = handler.updateOne(Coupon);

// @desc    Delete specific coupon
// @route   Delete /api/v1/coupons/:id
// @access  Private
exports.deleteCoupon = handler.deleteOne(Coupon);
