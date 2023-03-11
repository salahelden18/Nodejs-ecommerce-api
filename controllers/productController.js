const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");
// eslint-disable-next-line import/extensions
const factory = require("./handlersFactory.js");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catch_async");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    // save image into our db
    req.body.imageCover = imageCoverFilename;
  }

  if (req.files.images) {
    req.body.image = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);

        // save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

exports.createProduct = factory.createOne(Product);

exports.getProducts = factory.getAll(Product, "Products");

exports.getProduct = factory.getOne(Product, "reviews");

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
