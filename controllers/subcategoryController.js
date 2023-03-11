const Subcategory = require("../models/subCategoryMode");
const factory = require("./handlersFactory.js");

exports.setCategoryIdToBody = (req, res, next) => {
  // for applying nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubcategory = factory.createOne(Subcategory);

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};

  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

exports.getSubcategories = factory.getAll(Subcategory);

exports.getSubcategory = factory.getOne(Subcategory);

exports.updateSubcategory = factory.updateOne(Subcategory);

exports.deleteSubcategory = factory.deleteOne(Subcategory);
