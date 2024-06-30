const asyncHandler = require("express-async-handler");
const Course = require("../Models/courseModel");
const Coupon = require("../Models/couponModel");
const Cart = require("../Models/cartModel");

const calcCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/Student
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  let cart = await Cart.findOne({ user: req.user._id });

  if (!course) throw new Error(`Course with id ${courseId} not found`);

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ course: courseId, price: course.price }],
    });
  } else {
    // course not exist in cart, push course to cartItems array
    const courseIndex = cart.cartItems.findIndex(
      (item) => item.course.toString() === courseId
    );

    if (courseIndex < 0) {
      cart.cartItems.push({ course: courseId, price: course.price });
    }
  }

  // update cart total price
  calcCartTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Course added successfully to your cart",
    data: cart,
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new Error(`Cart is empty`);

  cart.discountedPrice = undefined;
  await cart.save();

  res
    .status(200)
    .json({ success: true, items: cart.cartItems.length, data: cart });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:courseId
// @access  Private/User
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { course: req.params.courseId } },
    },
    { new: true }
  );

  if (cart) {
    calcCartTotalPrice(cart);
    await cart.save();
  }

  res.status(204).json({
    success: true,
    message: "Item removed successfully from your cart",
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/apply-coupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new Error(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const { totalPrice } = cart;

  // 3) Calculate price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.discountedPrice = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    CartItems: cart.cartItems.length,
    data: cart,
  });
});
