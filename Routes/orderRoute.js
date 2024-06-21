const express = require("express");
const csrfProtection = require("../utils/csrfToken");

const {
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  checkoutSession,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get(
  "/checkout-session/:cartId",
  csrfProtection,
  authService.allowedTo("student"),
  checkoutSession
);

router.get(
  "/",
  authService.allowedTo("student", "instructor"),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get("/:id", findSpecificOrder);

router.put("/:id/pay", authService.allowedTo("instructor"), updateOrderToPaid);

module.exports = router;
