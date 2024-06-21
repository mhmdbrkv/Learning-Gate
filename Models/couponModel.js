const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "coupon required"],
      unique: [true, "coupon name must be unique"],
      trim: true,
    },

    expire: { type: Date, required: [true, "coupon required"] },

    discount: { type: Number, required: [true, "discount required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
