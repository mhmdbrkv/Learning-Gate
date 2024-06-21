const asyncHandler = require("express-async-handler");
const Section = require("../Models/sectionModel");
const { removeFromCloudinary } = require("../Middlewares/cloudinaryMiddleware");

// @desc Add sections into course by courseId
// @route   POST /api/v1/sections/:courseId
// @access  Private/Instructor
exports.addSection = asyncHandler(async (req, res, next) => {
  const section = await Section.create({
    course: req.params.courseId,
    sectionName: req.body.sectionName,
  });

  res.status(200).json({
    status: true,
    message: "Sections added successfully",
    data: section,
  });
});

// @desc Get sections by courseId
// @route   GET /api/v1/sections/:courseId
// @access  Public
exports.getSections = asyncHandler(async (req, res, next) => {
  const sections = await Section.find({ course: req.params.courseId });

  res.status(200).json({
    status: true,
    numOfSections: sections.length,
    data: sections,
  });
});

// @desc Get lectures by sectionId
// @route   GET /api/v1/sections/:sectionId/lectures
// @access  Public
exports.getLectures = asyncHandler(async (req, res, next) => {
  const sections = await Section.find({ _id: req.params.sectionId });

  res.status(200).json({
    status: true,
    numOfLectures: sections.lectures.length,
    data: sections.lectures,
  });
});

// @desc Add lecture into section by sectionId
// @route   POST /api/v1/sections/:sectionId/add-lecture
// @access  Private/Instructor
exports.addLecture = asyncHandler(async (req, res, next) => {
  const section = await Section.findOneAndUpdate(
    { _id: req.params.sectionId },
    {
      $addToSet: {
        lectures: {
          name: req.body.name,
          url: req.result.secure_url,
          public_id: req.result.public_id,
        },
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: "Lectures added successfully",
    numOfSections: section.lectures.length,
    data: section.lectures,
  });
});

// @desc Remove lecture from section by sectionId
// @route   Delete /api/v1/sections/:sectionId/remove-lecture/:lectureId
// @access  Private
exports.removeLecture = asyncHandler(async (req, res, next) => {
  const section = await Section.findOne({ _id: req.params.sectionId });
  if (!section) {
    throw new Error(
      "No section found for this id or you are not the instructor of this course"
    );
  }
  let lecture;

  section.lectures.forEach((item) => {
    if (item._id.toString() === req.params.lectureId) {
      lecture = item;
    }
  });
  removeFromCloudinary(lecture.public_id, "video");

  await Section.findOneAndUpdate(
    { _id: req.params.sectionId },
    {
      $pull: { lectures: { _id: req.params.lectureId } },
    }
  );

  res.status(200).json({
    status: true,
    message: "Lecture removed successfully",
  });
});
