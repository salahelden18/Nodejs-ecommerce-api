const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const catchAsync = require("../utils/catch_async");
const AppError = require("../utils/AppError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // 1- create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- generete token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

exports.protect = catchAsync(async (req, res, next) => {
  // check if token exist or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "you are not logged in! please login to get access to this route",
        401
      )
    );
  }

  // verify token (no changes happed, token expires)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user exists
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new AppError(
        "the user that belong to this token does no longer exist",
        401
      )
    );
  }

  // check is user changed password after token is created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new AppError(
          "User Recently changed his password. Please login again",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to acces this route", 403));
    }
    next();
  });

exports.forgorPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email in body
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  // 2) if user exist, generate random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // save password reset code into db
  user.passwordResetCode = hashedResetCode;
  // add time expiration for password reset code
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // means 10 minutes
  user.passwordResetVerified = false;

  await user.save();

  const message = `
  Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n${resetCode}\n 
  Enter this code to complete the reset.\n
  Thanks for helping us keep your account secure.\nThe E-shop Team
  `;

  // 3) send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code (valid for 10 minutes)",
      message,
    });
  } catch (e) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    return next(new AppError("There is an error in sending email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Reset Code sent to email",
  });
});

exports.verifyPassResetCode = catchAsync(async (req, res, next) => {
  // 1) get user based on the reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.bodyresetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Reset Code invalid or expired", 400));
  }

  // reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with the provided email", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new AppError("Reset Code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // generate token
  const token = createToken(user._id);

  res.status(200).json({
    token,
  });
});
