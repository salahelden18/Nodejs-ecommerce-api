const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));

router
  .route("/")
  .post(cartController.addProductToCart)
  .get(cartController.geLoggedUserCart)
  .delete(cartController.clearLoggedUserCart);

router
  .route("/:itemId")
  .delete(cartController.removeSpecificCartItem)
  .patch(cartController.updateCartItemQuantity);

router.patch("/applyCoupon", cartController.applyCouponOnCart);

// router
//   .route("/:id")
//   .get(cartController.getBrand)
//   .patch(
//     authController.protect,
//     authController.allowedTo("admin"),
//     cartController.updateBrand
//   )
//   .delete(
//     authController.protect,
//     authController.allowedTo("admin"),
//     cartController.deleteBrand
//   );

module.exports = router;
