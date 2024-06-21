const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const Course = require("../Models/courseModel");

// Aggregation function
const aggregateRatings = async function (courseId, reviewModel, courseModel) {
  const result = await reviewModel.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        avgRatings: { $avg: "$rating" },
        ratingsNumber: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await courseModel.findByIdAndUpdate(courseId, {
      avgRatings: result[0].avgRatings,
      ratingsNumber: result[0].ratingsNumber,
    });
  }
};

exports.deleteOne = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    await Model.deleteOne({ _id: id });

    //Apply aggregation after deleting a review
    if (modelName === "Review") {
      aggregateRatings(document.course, Model, Course);
    }

    res.status(204).send();
  });

exports.updateOne = (Model, modelName = "") =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }

    //Apply aggregation after updating a review
    if (modelName === "Review") {
      aggregateRatings(document.course, Model, Course);
    }

    res
      .status(201)
      .json({ status: true, message: "Updated successfully", data: document });
  });

exports.createOne = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);

    //Applying aggregation after creating a review
    if (modelName === "Review") {
      aggregateRatings(
        new mongoose.Types.ObjectId(req.body.course),
        Model,
        Course
      );
    }

    res.status(201).json({
      status: true,
      message: "Created successfully",
      data: newDocument,
    });
  });

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res) => {
    // 1) Build the query
    let query = Model.findById(req.params.id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    // 2) Excute the query
    const document = await query;
    if (!document) {
      throw new ApiError(`No document with the id of ${req.params.id}`, 404);
    }
    res.status(200).json({ status: true, data: document });
  });

exports.gettAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filter) {
      filter = { ...req.filter };
    }

    // Build the query
    const numOfDocument = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(numOfDocument)
      .filter()
      .limitFields()
      .search(modelName)
      .sort();

    const { mongooseQuery, pagination } = apiFeatures;

    // Excute the query
    const docs = await mongooseQuery;

    res.status(200).json({
      status: true,
      results: docs.length,
      pagination,
      data: docs,
    });
  });
