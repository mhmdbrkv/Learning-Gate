const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        course: {
          type: mongoose.Schema.ObjectId,
          ref: "Course",
        },
        price: Number,
      },
    ],
    totalCartPrice: {
      type: Number,
      default: 0,
    },
    totalPriceAfterDiscount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.course",
    select: "title",
  });

  next();
});

module.exports = mongoose.model("Cart", cartSchema);
