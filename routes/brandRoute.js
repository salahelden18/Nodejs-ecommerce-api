const express = require("express");
const brandController = require("../controllers/brandcontroller");
const authController = require("../controllers/authController");
const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brandValidator");

// const subcategoriesRoute = require("./subBrandRoute");

const router = express.Router();

// router.use("/:BrandId/subcategories", subcategoriesRoute);

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    brandController.uploadBrandImage,
    brandController.resizeImage,
    createBrandValidator,
    brandController.createBrand
  )
  .get(brandController.getBrands);

router
  .route("/:id")
  .get(getBrandValidator, brandController.getBrand)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    updateBrandValidator,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteBrandValidator,
    brandController.deleteBrand
  );

module.exports = router;
