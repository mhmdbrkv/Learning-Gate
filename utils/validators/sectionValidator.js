const { check } = require("express-validator");
const validatorMiddleware = require("../../Middlewares/validationMiddleware");
const Course = require("../../Models/courseModel");
const Section = require("../../Models/sectionModel");

exports.addSectionValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("course id required")
    .isMongoId()
    .withMessage("invalid course id format")
    .custom(async (value, { req }) => {
      const course = await Course.findOne({
        _id: value,
        instructor: req.user._id,
      });
      if (!course) {
        throw new Error(
          "No course found for this id or you are not the instructor of this course"
        );
      }
      return true;
    }),
  check("sectionName")
    .notEmpty()
    .withMessage("sectionName required")
    .custom(async (value, { req }) => {
      const section = await Section.findOne({
        sectionName: value,
      });
      if (section) {
        throw new Error("There is a section with the same name");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.addlectureValidator = [
  check("sectionId")
    .notEmpty()
    .withMessage("section id required")
    .isMongoId()
    .withMessage("invalid section id format")
    .custom(async (value, { req }) => {
      const section = await Section.findOne({ _id: value });
      let course;

      if (section) {
        course = await Course.findOne({
          _id: section.course,
          instructor: req.user._id,
        });
      }

      if (!section || !course) {
        throw new Error(
          "No section found for this id or you are not the instructor of this course"
        );
      }

      return true;
    }),

  check("name")
    .notEmpty()
    .withMessage("lecture name required")
    .custom(async (value, { req }) => {
      const section = await Section.findById(req.params.sectionId);
      section.lectures.forEach((item) => {
        if (item.name === value) {
          throw new Error("There is a lecture with the same name");
        }
      });

      return true;
    }),
  validatorMiddleware,
];

exports.updateSectionValidator = [
  check("sectionId")
    .notEmpty()
    .withMessage("section id required")
    .isMongoId()
    .withMessage("invalid section id format")
    .custom(async (value, { req }) => {
      const section = await Section.findOne({ _id: value });

      if (!section) {
        throw new Error(
          "No section found to delete or you are not the instructor of this course"
        );
      }

      return true;
    }),

  validatorMiddleware,
];

exports.lectureValidator = [
  check("sectionId")
    .notEmpty()
    .withMessage("section id required")
    .isMongoId()
    .withMessage("invalid section id format")
    .custom(async (value, { req }) => {
      const section = await Section.findOne({ _id: value });

      if (!section) {
        throw new Error(
          "No section found to delete or you are not the instructor of this course"
        );
      }

      return true;
    }),
  check("lectureId")
    .notEmpty()
    .withMessage("lecture id required")
    .isMongoId()
    .withMessage("invalid lecture id format"),
  validatorMiddleware,
];
