const User = require("../models/userModel");
const catchAsync = require("../utils/catch_async");

exports.addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Address Added Successfully",
    data: user.addresses,
  });
});

exports.removeAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed Successfully",
    data: user.addresses,
  });
});

exports.getLoggedUserAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
