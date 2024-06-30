const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: [true, "User first  name is required"],
      trim: true,
      minLength: [4, "User name must be at least 4 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      minLength: [4, "User name must be at least 4 characters"],
    },
    email: {
      type: String,
      require: [true, "User email required"],
      unique: [true, "User email must be unique"],
    },
    profileImage: {
      url: String,
      public_id: String,
    },
    password: {
      type: String,
      require: [true, "User password required"],
      minLength: [6, "User name must be at least 6 characters"],
    },

    myLearning: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],
    myCourses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
    ],

    headline: {
      type: String,
      maxlength: [60, "Headline must be less than 60 characters"],
    },

    biography: String,
    social: [String],

    interests: {
      type: [String],
      trim: true,
      default: [],
    },

    accountType: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    isActive: { type: Boolean, default: true },
    passChangedAt: Date,
    passResetCode: String,
    passResetCodeEat: Date,
    passResetCodeVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 11);
  next();
});

module.exports = mongoose.model("User", userSchema);
