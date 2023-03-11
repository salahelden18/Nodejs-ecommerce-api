const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Category = require("../models/categoryModel");
// eslint-disable-next-line import/extensions
const factory = require("./handlersFactory.js");
const catchAsync = require("../utils/catch_async");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Date.now().jpeg
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = catchAsync(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  // save image into our db
  req.body.image = filename;

  next();
});

exports.createCategory = factory.createOne(Category);

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
