const mongoose = require("mongoose");

//create schema for lecture
const lectureSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "lecture's name required"],
  },
  url: String,
  public_id: String,
});

//create schema for course content
const sectionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    require: [true, "course id is required"],
  },
  sectionName: {
    type: String,
    require: [true, "section's name required"],
  },
  lectures: [lectureSchema],

  numOfLectures: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Section", sectionSchema);
