const Cart = require("../models/cartModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catch_async");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  cart.totalPriceAfterDiscount = undefined;

  return totalPrice;
};

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);

  // 1) Get Cart For Logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart.user.equals(req.user._id)) {
    return next(new AppError("You are not allowed to access this", 401));
  }

  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.equals(productId) && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist push product to cart Items
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // calculate total cart price
  cart.totalCartPrice = calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product Added to cart Successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.geLoggedUserCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("There is no cart for this user", 404));
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeSpecificCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  cart.totalCartPrice = calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearLoggedUserCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).json();
});

exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("There is not cart for this user", 404));
  }

  const itemIndex = cart.cartItems.findIndex((item) =>
    item._id.equals(req.params.itemId)
  );

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];

    cartItem.quantity = quantity;

    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new AppError("There in no item for this ID", 404));
  }

  cart.totalCartPrice = calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.applyCouponOnCart = catchAsync(async (req, res, next) => {
  // 1) get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError("Coupon is expired or invalid", 400));
  }

  // 2) get logged user cart to get total price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
