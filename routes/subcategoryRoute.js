const express = require("express");
const {
  createSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../controllers/subcategoryController");
const authController = require("../controllers/authController");
const {
  createSubcategoryValidator,
  getSubcategoryValidator,
  updateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require("../utils/validators/subcategoryValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    setCategoryIdToBody,
    createSubcategoryValidator,
    createSubcategory
  )
  .get(createFilterObject, getSubcategories);

router
  .route("/:id")
  .get(getSubcategoryValidator, getSubcategory)
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    updateSubcategoryValidator,
    updateSubcategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteSubcategoryValidator,
    deleteSubcategory
  );

module.exports = router;
