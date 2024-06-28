const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    content: String,
    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
      require: [true, "Review rating is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "Review must belong to a user"],
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      require: [true, "Review must belong to a course"],
    },
  },
  { timestamps: true }
);

// mongoose query middleware for populating the `user` field
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstname lastname profileImage",
  });
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
