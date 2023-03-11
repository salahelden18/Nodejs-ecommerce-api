const AppError = require("../utils/AppError");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catch_async");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError("No document found for the provided Id", 404));
    }

    // to trigger remove middleware
    await document.remove();

    res.status(204).json({
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError("No document found for the provided Id", 404));
    }

    // trigger save event when updating document
    await document.save();

    res.status(200).json({
      data: document,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      data: newDoc,
    });
  });

exports.getOne = (Model, populationOpt) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);

    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    const document = await query;

    if (!document) {
      return next(new AppError("No document found for the provided Id", 404));
    }

    res.status(200).json({
      data: document,
    });
  });

exports.getAll = (Model, modelName = "") =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const docs = await mongooseQuery;

    res.status(200).json({
      results: docs.length,
      paginationResult,
      data: docs,
    });
  });
