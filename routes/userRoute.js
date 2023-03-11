const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router.get(
  "/getMe",
  authController.protect,
  userController.getLoggedUserData,
  userController.getUser
);

router.patch(
  "/changeMyPassword",
  authController.protect,
  userController.updateLoggedUserPassword
);

router.patch(
  "/updateMe",
  authController.protect,
  updateLoggedUserValidator,
  userController.updateLoggedUserData
);

router.delete(
  "/deleteMe",
  authController.protect,
  userController.deleteLoggedUserData
);

// admin
router.patch(
  "/changePassword/:id",
  changeUserPasswordValidator,
  userController.changeUserPassword
);

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.resizeImage,
    createUserValidator,
    userController.createUser
  )
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    userController.getUsers
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    getUserValidator,
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.allowedTo("admin"),
    userController.uploadUserImage,
    userController.resizeImage,
    updateUserValidator,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteUserValidator,
    userController.deleteUser
  );

module.exports = router;
