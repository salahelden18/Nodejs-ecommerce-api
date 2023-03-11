const express = require("express");

const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");

const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subcategoriesRoute = require("./subcategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    createCategoryValidator,
    categoryController.createCategory
  )
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getCategory)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
