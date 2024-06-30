const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const handler = require("./handlersFactory");
const Cart = require("../Models/cartModel");
const User = require("../Models/userModel");

const Order = require("../Models/orderModel");

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findAllOrders = handler.gettAll(Order);

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findSpecificOrder = handler.getOne(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ success: true, data: updatedOrder });
});

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // getting course name and price out of cart items
  const courses = [];
  cart.cartItems.forEach(async (e) => {
    courses.push({ name: e.course.title, price: e.price });
  });

  // 3) Create stripe checkout session
  try {
    // Create Stripe checkout session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: courses.map((item) => {
        const { name, price } = item;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: name,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        };
      }),
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
    });

    res.status(200).json({
      success: true,
      message: "Created successfully",
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
  });

  // 4) Clear cart depend on cartId
  await Cart.findByIdAndDelete(cartId);
};

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ status: true });
});
