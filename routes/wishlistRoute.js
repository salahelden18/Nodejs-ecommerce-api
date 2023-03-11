const express = require("express");
const authController = require("../controllers/authController");
const wishListController = require("../controllers/wishlistController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));

router
  .route("/")
  .post(wishListController.addProductToWishList)
  .get(wishListController.getLoggedUserWishlist);

router
  .route("/:productId")
  .delete(wishListController.removeProductFromWishList);

module.exports = router;
