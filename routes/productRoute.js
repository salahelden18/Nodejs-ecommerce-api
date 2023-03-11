const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../utils/validators/productValidator");

const reviewRoute = require("./reviewsRoute");

const router = express.Router();

router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    createProductValidator,
    productController.createProduct
  )
  .get(productController.getProducts);

router
  .route("/:id")
  .get(getProductValidator, productController.getProduct)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    updateProductValidator,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
