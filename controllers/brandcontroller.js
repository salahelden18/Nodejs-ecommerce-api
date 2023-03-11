const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Brand = require("../models/brandModel");
// eslint-disable-next-line import/extensions
const factory = require("./handlersFactory.js");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const catchAsync = require("../utils/catch_async");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = catchAsync(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  // save image into our db
  req.body.image = filename;

  next();
});

exports.createBrand = factory.createOne(Brand);

exports.getBrands = factory.getAll(Brand);

exports.getBrand = factory.getOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);
