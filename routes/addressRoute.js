const express = require("express");
const authController = require("../controllers/authController");
const addressController = require("../controllers/addressController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));

router
  .route("/")
  .post(addressController.addAddress)
  .get(addressController.getLoggedUserAddresses);

router.route("/:addressId").delete(addressController.removeAddress);

module.exports = router;
