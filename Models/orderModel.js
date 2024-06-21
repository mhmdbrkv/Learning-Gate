const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to user"],
    },
    cartItems: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        price: Number,
      },
    ],

    totalOrderPrice: {
      type: Number,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({
    path: "cartItems.course",
    select: "title",
  });

  next();
});

module.exports = mongoose.model("Order", orderSchema);
