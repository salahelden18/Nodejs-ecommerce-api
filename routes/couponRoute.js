const express = require("express");

const couponController = require("../controllers/couponController");
const authController = require("../controllers/authController");

// const subcategoriesRoute = require("./subBrandRoute");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("admin"));

router
  .route("/")
  .post(couponController.createCoupon)
  .get(couponController.getCoupons);

router
  .route("/:id")
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

module.exports = router;
