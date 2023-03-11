const User = require("../models/userModel");
const catchAsync = require("../utils/catch_async");

exports.addProductToWishList = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Product Added Successfully to your wishlist",
    data: user.wishlist,
  });
});

exports.removeProductFromWishList = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed Successfully from your wishlist",
    data: user.wishlist,
  });
});

exports.getLoggedUserWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
