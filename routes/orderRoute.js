const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/:cartId")
  .post(authController.allowedTo("user"), orderController.createCashOrder);

router.get(
  "/",
  authController.allowedTo("user", "admin"),
  orderController.filterOrdersForLoggedUser,
  orderController.findAllOrders
);

router.get(
  "/:id",
  authController.allowedTo("user", "admin"),
  orderController.findSpecificOrder
);

router.patch(
  "/:id/pay",
  authController.allowedTo("admin"),
  orderController.updateOrderToPaid
);
router.patch(
  "/:id/deliver",
  authController.allowedTo("admin"),
  orderController.updateOrderToDelivered
);

module.exports = router;
