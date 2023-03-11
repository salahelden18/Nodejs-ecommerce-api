const express = require("express");
const authController = require("../controllers/authController");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, authController.signup);
router.post("/login", loginValidator, authController.login);

router.post("/forgotPassword", authController.forgorPassword);
router.post("/verifyResetCode", authController.verifyPassResetCode);
router.patch("/resetPassword", authController.resetPassword);

module.exports = router;
