const express = require("express");

const reviewController = require("../controllers/reviewsController");

const authController = require("../controllers/authController");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.createFilterObj, reviewController.getReviews)
  .post(
    authController.protect,
    authController.allowedTo("user"),
    reviewController.setProductIdAndUserIdToBody,
    createReviewValidator,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, reviewController.getReview)
  .patch(
    authController.protect,
    authController.allowedTo("user"),
    updateReviewValidator,
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    reviewController.deleteReview
  );

module.exports = router;
