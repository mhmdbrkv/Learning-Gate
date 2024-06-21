const mongoose = require("mongoose");

// 1- Create Schema

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "subCategory required"],
      unique: [true, "subCategory must be unique"],
      minlength: [2, "Too short subCategory name"],
      maxlength: [32, "Too long subCategory name"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      require: [true, "Category required"],
    },
  },
  { timestamps: true }
);

// 2- Create model
const SubCategory = mongoose.model("subCategory", subCategorySchema);

module.exports = SubCategory;
